import React from 'react';
import { get } from 'lodash';
import { swapArrayElements, isMouseBeyond } from './Sortable/helpers';

export interface IGroupListItemProps {
  [groupName: string]: {
    count: number,
    index: number,
    subList: string[],
  }
}

export interface IUpdateStateProps {
  draggingIndex: number | null,
  items?: IGroupListItemProps[],
  prevDraggingIndex?: number,
}

export interface IMergingProps {
  draggingIndex: number | null,
  targetSubItems: string[],
  currSubItems: string[],
}

export interface IDraggingProps {
  'data-id': string,
  draggable: boolean,
  key: string,
  onDragEnd: (e: DragEvent) => void,
  onDragOver: (e: DragEvent) => void,
  onDragStart: (e: DragEvent) => void,
  onDrop: (e: DragEvent) => void,
  onTouchEnd: (e: DragEvent) => void,
  onTouchMove: (e: DragEvent) => void,
  onTouchStart: (e: DragEvent) => void,
  tabIndex: number,
}
interface IProps {
  updateState: (props: IUpdateStateProps) => void,
  merging: (props: IMergingProps) => void,
  unGroup: (props: {key: string}) => void,
  Component: (props:any) => JSX.Element,
  draggingIndex: number | null,
  SubComponent: ({
    draggingProps,
    key,
    subItem,
  }: {
    draggingProps:{
      'data-id': string,
      draggable: boolean,
      onDragEnd: (e: DragEvent) => void,
      onDragStart: (e: DragEvent) => void,
      onDrop: (e: DragEvent) => void,
      onTouchEnd: (e: DragEvent) => void,
      onTouchStart: (e: DragEvent) => void,
    },
    key: string,
    subItem: string,
  }) => JSX.Element,
  customProps?: any,
  items: IGroupListItemProps[],
}

interface IState {
  draggingIndex: null | number,
    endState: null | {
      currSubItems: string[],
      draggingIndex: null | number,
      prevDraggingIndex?: number,
      targetSubItems: string[],
    },
    parentDraggable: boolean,
}
export default class DragAndDropGroupList extends React.Component<IProps, IState> {
  state = {
    draggingIndex: null,
    endState: null,
    parentDraggable: true,
  };

  componentWillReceiveProps(nextProps: IProps) {
    this.setState({
      draggingIndex: nextProps.draggingIndex,
    });
  }

    sortEnd = (e: DragEvent) => {
      e.preventDefault();
      const { endState, parentDraggable } = this.state;
      if (!parentDraggable) {
        return;
      }
      const { merging, updateState } = this.props;
      if (endState) {
        merging(endState);
      }
      updateState({
        draggingIndex: null,
      });
    };

    sortStart = (e: DragEvent) => {
      const { parentDraggable } = this.state;

      if (!parentDraggable) {
        return;
      }
      const draggingIndex = get(e, 'currentTarget.dataset.id', null);
      const { updateState } = this.props;

      updateState({
        draggingIndex,
      });

      const dt = e.dataTransfer;
      if (dt) {
        dt.setData('text', get(e, 'target.innerHTML', ''));

        // fix http://stackoverflow.com/questions/27656183/preserve-appearance-of-dragged-a-element-when-using-html5-draggable-attribute
        if (dt.setDragImage && e.currentTarget) {
          const currentTarget = e.currentTarget as HTMLElement;
          if (currentTarget.tagName.toLowerCase() === 'a' && e.target) {
            const target = e.target as HTMLElement;
            dt.setDragImage(target, 0, 0);
          }
        }
      }
    };

    dragOver = (e: DragEvent) => {
      const { draggingIndex, parentDraggable } = this.state;
      if (!parentDraggable) {
        return;
      }
      this.setState({
        endState: null,
      });
      e.preventDefault();
      let { items } = this.props;
      const { updateState } = this.props;
      const overEl = e.currentTarget as HTMLElement; // underlying element
      if (!overEl) {
        return;
      }
      const indexDragged = Number(overEl.dataset.id); // index of underlying element
      const indexFrom = Number(draggingIndex);
      const { height, left, width } = overEl.getBoundingClientRect();
      const positionX = e.clientX;
      const positionY = e.clientY;
      const topOffset = overEl.getBoundingClientRect().top;
      const targetGroupName = Object.keys(items[indexDragged])[0];
      const targetSubItems = Object.values(items[indexDragged])[0].subList;
      const currSubItems = Object.values(items[indexFrom])[0].subList;

      const mouseBeyond = isMouseBeyond(positionY, topOffset, height, false);
      if (indexDragged !== indexFrom && mouseBeyond) {
        const isMouseCross =
          positionX - left > width / 5;
        const isTargetAGroup = targetSubItems.length > 1 || targetGroupName !== targetSubItems[0];
        if (isTargetAGroup && isMouseCross) {
          this.setState({
            endState: {
              currSubItems,
              draggingIndex: indexDragged,
              prevDraggingIndex: indexFrom,
              targetSubItems,
            },
          });
          return;
        }
        items = swapArrayElements(items, indexFrom, indexDragged);
        updateState({
          draggingIndex: indexDragged,
          items,
          prevDraggingIndex: indexFrom,
        });
      }
    };

    subItemDragStart = () => {
      this.setState({
        parentDraggable: false,
      });
    }

    subItemDragEnd = (e: DragEvent) => {
      e.stopPropagation();
      const { unGroup, updateState } = this.props;
      this.setState({ parentDraggable: true });
      const itemKey = get(e, 'currentTarget.dataset.id', undefined);
      if (!itemKey) {
        return;
      }
      const target = e.currentTarget as HTMLElement;
      if (!target) {
        return;
      }
      const parentTarget = target.parentElement;
      if (!parentTarget) {
        return;
      }
      const positionY = e.clientY;
      const targetHeight = target.getBoundingClientRect().height;
      const parentTop = parentTarget.getBoundingClientRect().top;
      const parentHeight = parentTarget.getBoundingClientRect().height;
      const mouseBeyond =
        positionY > parentTop + parentHeight + targetHeight || positionY < parentTop;
      if (mouseBeyond) {
        unGroup({ key: itemKey });
      }
      updateState({
        draggingIndex: null,
      });
    }

    render() {
      const {
        Component,
        customProps,
        items,
        SubComponent,
      } = this.props;
      return (
        <React.Fragment>
          {items.map((groupObj, i) => {
            const groupName = Object.keys(groupObj)[0];
            const group = Object.values(groupObj)[0].subList;
            return (
              <Component
                draggingProps={{
                  'data-id': i,
                  draggable: true,
                  key: groupName,
                  onDragEnd: this.sortEnd,
                  onDragOver: this.dragOver,
                  onDragStart: this.sortStart,
                  onDrop: this.sortEnd,
                  onTouchEnd: this.sortEnd,
                  onTouchMove: this.dragOver,
                  onTouchStart: this.sortStart,
                  tabIndex: i,
                }}
                group={group}
                groupName={groupName}
                key={groupName}
                {...customProps}
                >
                {(group.length > 1 || group[0] !== groupName) && group.map(subItem => (
                  <SubComponent
                    draggingProps={{
                      'data-id': subItem,
                      draggable: true,
                      onDragEnd: this.subItemDragEnd,
                      onDragStart: this.subItemDragStart,
                      onDrop: this.subItemDragEnd,
                      onTouchEnd: this.subItemDragEnd,
                      onTouchStart: this.subItemDragStart,
                    }}
                    key={subItem}
                    subItem={subItem}
                    />
                ))}
              </Component>
            );
          })}
        </React.Fragment>
      );
    }
}
