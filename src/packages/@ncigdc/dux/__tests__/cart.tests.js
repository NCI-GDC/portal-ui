/* @flow */
import { range } from 'lodash';

import {
  addAllFilesInCart,
  removeAllInCart,
  toggleFilesInCart,
  UPDATE_CART,
  ADD_TO_CART,
  CLEAR_CART,
  CART_FULL,
  reducer,
  MAX_CART_SIZE,
} from '../cart';

const fileA = { file_id: 'a', access: 'open', file_size: 0, projects: [] };
const fileB = { file_id: 'b', access: 'open', file_size: 0, projects: [] };

describe('action creators', () => {
  const storeInitalState = { cart: { files: [] } };
  it('should add one file', () => {
    const getState = () => storeInitalState;
    const dispatch = jest.fn();
    addAllFilesInCart(fileA)(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith({
      type: ADD_TO_CART,
      payload: [fileA],
    });
  });

  it('should add an array of files', () => {
    const getState = () => storeInitalState;
    const dispatch = jest.fn();
    addAllFilesInCart([fileA, fileB])(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith({
      type: ADD_TO_CART,
      payload: [fileA, fileB],
    });
  });

  it('should allow up to MAX_CART_SIZE files to be added', () => {
    const getState = () => ({
      cart: {
        files: range(0, MAX_CART_SIZE - 1).map(id => ({
          ...fileA,
          file_id: id,
        })),
      },
    });
    const dispatch = jest.fn();
    addAllFilesInCart(fileA)(dispatch, getState);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith({
      type: ADD_TO_CART,
      payload: [fileA],
    });
  });

  it('should not allow more than MAX_CART_SIZE files to be added', () => {
    const getState = () => ({
      cart: {
        files: range(0, MAX_CART_SIZE).map(id => ({ ...fileA, file_id: id })),
      },
    });
    const dispatch = jest.fn();
    addAllFilesInCart(fileA)(dispatch, getState);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith({ type: CART_FULL });
  });

  it('should remove all files in cart', () => {
    const getState = () => ({ cart: { files: [fileA, fileB] } });
    const dispatch = jest.fn();
    removeAllInCart()(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_CART, payload: [] });
  });

  it('should allow a file to be toggled in', () => {
    const getState = () => ({ cart: { files: [] } });
    const dispatch = jest.fn();
    toggleFilesInCart(fileA)(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith({
      type: UPDATE_CART,
      payload: [fileA],
    });
  });

  it('should allow a file to be toggled out', () => {
    const getState = () => ({ cart: { files: [fileA] } });
    const dispatch = jest.fn();
    toggleFilesInCart(fileA)(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith({ type: UPDATE_CART, payload: [] });
  });

  it('should allow up to max to be toggled in', () => {
    const getState = () => ({
      cart: {
        files: range(0, MAX_CART_SIZE - 1).map(id => ({
          ...fileA,
          file_id: id,
        })),
      },
    });
    const dispatch = jest.fn();
    toggleFilesInCart(fileA)(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith({
      type: UPDATE_CART,
      payload: [...getState().cart.files, fileA],
    });
  });

  it('should not allow more files than max to be toggled in', () => {
    const getState = () => ({
      cart: {
        files: range(0, MAX_CART_SIZE).map(id => ({ ...fileA, file_id: id })),
      },
    });
    const dispatch = jest.fn();
    toggleFilesInCart(fileA)(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith({ type: CART_FULL });
  });
});

describe('reducer', () => {
  const initalState = { files: [] };
  it('inital state should have 0 files', () => {
    expect(reducer(undefined, {})).toEqual(initalState);
  });
  it('should handle ADD_TO_CART', () => {
    expect(
      reducer(initalState, {
        type: ADD_TO_CART,
        payload: [fileA],
      }),
    ).toEqual({ files: [fileA] });
  });
  it('should handle UPDATE_CART', () => {
    expect(
      reducer(
        { files: [fileA] },
        {
          type: UPDATE_CART,
          payload: [fileB],
        },
      ),
    ).toEqual({ files: [fileB] });
  });
  it('should handle CLEAR_CART', () => {
    expect(
      reducer(
        { files: [fileA] },
        {
          type: CLEAR_CART,
        },
      ),
    ).toEqual({ files: [] });
  });
});
