import React from 'react';
import { get } from 'lodash';
import { swapArrayElements, isMouseBeyond } from './Sortable/helpers';

interface IProps {
  updateState: (props: any) => void,
  merging: (props: any) => void,
  unGroup: (props: {key: string}) => void,
  Component: any,
  [x:string]:any,
  items: Array<{
    [groupName:string]: {
      count: number,
      index: number,
      subList: string[],
    }
  }>,
}

// interface IState {
//   draggingIndex: null | number,
//   endState: {
//     currSubItems: string[],
//     draggingIndex: number,
//     prevDraggingIndex: number,
//     targetSubItems: string[],
//   },
//   parentDraggable: boolean,
// }

export default class DragAndDropGroupList extends React.Component<IProps, any> {
  state = {
    draggingIndex: null,
    endState: null,
    parentDraggable: true,
  };

  componentWillReceiveProps(nextProps: any) {
    this.setState({
      draggingIndex: nextProps.draggingIndex,
    });
  }

    sortEnd = (e: any) => {
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

    sortStart = (e: any) => {
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
      if (dt !== undefined) {
        dt.setData('text', e.target.innerHTML);

        // fix http://stackoverflow.com/questions/27656183/preserve-appearance-of-dragged-a-element-when-using-html5-draggable-attribute
        if (dt.setDragImage && e.currentTarget.tagName.toLowerCase() === 'a') {
          dt.setDragImage(e.target, 0, 0);
        }
      }
    };

    dragOver = (e: any) => {
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
      const overEl = e.currentTarget; // underlying element
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


    subItemDragEnd = (e: any) => {
      e.stopPropagation();
      const { unGroup, updateState } = this.props;
      this.setState({ parentDraggable: true });
      const itemKey = get(e, 'currentTarget.dataset.id', undefined);
      const target = e.currentTarget;
      const parentTarget = target.parentElement;
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
        draggingIndex,
        items,
        SubComponent,
        unGroup,
        updateState,
        ...resProps
      } = this.props;
      return (
        <React.Fragment>
          {items.map((groupObj, i) => {
            const groupName = Object.keys(groupObj)[0];
            const group = Object.values(groupObj)[0].subList;
            return (
              <Component
                data-id={i}
                draggable
                group={group}
                groupName={groupName}
                key={groupName}
                onDragEnd={this.sortEnd}
                onDragOver={this.dragOver}
                onDragStart={this.sortStart}
                onDrop={this.sortEnd}
                onTouchEnd={this.sortEnd}
                onTouchMove={this.dragOver}
                onTouchStart={this.sortStart}
                tabIndex={i}
                {...resProps}
                >
                {(group.length > 1 || group[0] !== groupName) && group.map(subItem => (
                  <SubComponent
                    data-id={subItem}
                    draggable
                    key={subItem}
                    onDragEnd={this.subItemDragEnd}
                    onDragStart={this.subItemDragStart}
                    onDrop={this.subItemDragEnd}
                    onTouchEnd={this.subItemDragEnd}
                    onTouchStart={this.subItemDragStart}
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
