import * as React from "react";
import {UIView, UISref, UISrefActive} from "../src/index";

export class Home extends React.Component<any,any> {
  render() {
    return (
      <div>
        UI-Router + React proof of concept
        <UIView name="header"></UIView>
        <UISrefActive class={'active'}>
          <UISref to={'home'} params={{foo:'bar'}}><a>Home</a></UISref>
        </UISrefActive>{' '}
        <UISrefActive class={'active'}>
          <UISref to={'home.child'}><a>Child</a></UISref>
        </UISrefActive>{' '}
        <UISrefActive class={'active'}>
          <UISref to={'home.child.nest'}>
            <button style={{marginLeft:100}}className="is-button" data-sorcio="foo">Nest</button>
          </UISref>
        </UISrefActive>{' '}
        <h2>Home</h2> 
        <UIView/>
      </div>
    );
  }
}
