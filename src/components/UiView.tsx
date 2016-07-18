import {Component, PropTypes, ValidationMap, createElement} from 'react';
import {UIRouter, ActiveUIView, ViewContext, ViewConfig} from "ui-router-core";
import {ReactViewConfig} from "../ui-router-react";

let id = 0;

let uiViewContexts: {
    [key: string]: {
        fqn: string;
        context: ViewContext;
    }
} = {};

export class UiView extends Component<any,any> {
    el;

    viewContext: ViewContext;
    fqn: string;

    uiViewData: ActiveUIView;
    deregister: Function;

    static childContextTypes: ValidationMap<any> = {
        uiViewId: PropTypes.number
    }

    static contextTypes: ValidationMap<any> = {
        uiViewId: PropTypes.number
    }

    constructor() {
        super();
        this.state = {
            component: 'div',
            resolves: {}
        }
    }

    render() {
        let { component, resolves } = this.state;
        let child = createElement(component, resolves);
        return child;
    }

    getChildContext() {
        return {
            uiViewId: (this.state && this.state.id) || 0
        }
    }

    componentDidMount() {
        let router = (UIRouter as any).instance as UIRouter;

        let parentFqn: string;
        let creationContext: ViewContext;
        let parentId: number = (this.context as any).uiViewId || 0;

        if (parentId === 0) {
            parentFqn = "";
            creationContext = router.stateRegistry.root();
        } else {
            parentFqn = uiViewContexts[parentId].fqn;
            creationContext = uiViewContexts[parentId].context;
        }

        let name = this.props.name || "$default";
        var uiViewData = this.uiViewData = {
            $type: 'react',
            id: ++id,
            name: name,
            fqn: parentFqn ? parentFqn + "." + name : name,
            creationContext: creationContext,
            configUpdated: this.viewConfigUpdated.bind(this),
            config: undefined
        } as ActiveUIView;

        uiViewContexts[uiViewData.id] = {
            get fqn() { return uiViewData.fqn; },
            get context() { return uiViewData.config && uiViewData.config.viewDecl.$context; }
        }

        this.deregister = router.viewService.registerUIView(this.uiViewData);
        this.setState({ id: uiViewData.id });
    }

    componentWillUnmount() {
        this.deregister();
        delete uiViewContexts[this.uiViewData.id];
    }

    viewConfigUpdated(newConfig: ReactViewConfig) {
        this.uiViewData.config = newConfig;
        let newComponent = newConfig && newConfig.viewDecl && newConfig.viewDecl.component;
        let resolves = {};
        if (newConfig) {
            let resolvables = newConfig.path[0].resolvables;
            newConfig.path.forEach(pathNode => {
                pathNode.resolvables.forEach(resolvable => {
                    if (typeof resolvable.token === 'string')
                    resolves[resolvable.token] = resolvable.data;
                });
            });
        }
        this.setState({ component: newComponent || 'div', resolves })
    }
}