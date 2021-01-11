import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { filter, map, pairwise, startWith } from 'rxjs/operators';
import { WidgetListComponent } from '../components';
import { LayerTreeComponent } from '../components/layer-tree/layer-tree.component';
import { PropertyFormComponent } from '../components/property-form/property-form.component';
import { DEFAULT_STORE, IPanel, IStore } from '../store';
import { CeUtilsService } from './utils.service';

@Injectable()
export class EditorStore<T = any> extends ComponentStore<IStore<T>> {
  panels: IPanel<any>[] = [
    { key: 'LAYERS', title: '图层', content: LayerTreeComponent, show: true, x: 10, y: 60 },
    { key: 'WIDGET_LIST', title: '组件', content: WidgetListComponent, show: false, x: 50, y: 60 },
    { key: 'PROPERTIES', title: '属性', content: PropertyFormComponent, show: true, x: window.innerWidth - 350, y: 60 },
  ];

  constructor(private utils: CeUtilsService) {
    super(DEFAULT_STORE);
  }

  initialize(state: IStore<T>) {
    this.setState(state);
  }

  dispatch(action: (state: IStore<T>) => IStore<T>) {
    this.setState(action);
  }

  selectDifferent<R>(cb: (state: IStore<T>) => R) {
    return this.select(cb).pipe(
      startWith(0, 0),
      pairwise<R>(),
      filter(([prev, present]) => !this.utils.isDeepEqual(prev, present)),
      map(([, present]) => present)
    );
  }

  toJSON() {
    const state = this.get();
    return JSON.stringify({
      canvasPosition: state.canvasPosition,
      canvasSize: state.canvasSize,
      canvasBackground: state.canvasBackground,
      nodes: state.nodes,
      selected: state.selected,
      bordered: state.bordered,
    });
  }
}
