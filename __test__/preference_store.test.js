import { act, renderHook } from '@testing-library/react-hooks/dom';
import { usePreferences  } from "../renderer/stores/preferences_store";

const initLabel = [
  {
    "title":"Blue",
    "color":"#2196f3",
    "describe":"Default"
  },{
    "title":"Green",
    "color":"#4caf50",
    "describe":"Default"
  },{
    "title":"Red",
    "color":"#f44336",
    "describe":"Default"
  },{
    "title":"Yellow",
    "color":"#ff9800",
    "describe":"normal"
  }
]

const createLabelResult = [
  {
    "key":"6ac8aa3c-e675-4123-a825-2b2e80cb0034",
    "title":"Blue",
    "color":"#2196f3",
    "describe":"Default"
  },{
    "key":"15839095-7902-4bd3-8c91-4eb2cd8aa5fd",
    "title":"Green",
    "color":"#4caf50",
    "describe":"Default"
  },{
    "key":"5be2a906-08ff-4a22-b778-ccc75bc8471f",
    "title":"Red",
    "color":"#f44336",
    "describe":"Default"
  },{
    "key":"21e563d3-beda-4fd5-9566-d8ae31f0ef79",
    "title":"Yellow",
    "color":"#ff9800",
    "describe":"normal"
  },{
    "title":"test",
    "color":"#fc605f",
    "describe":"Default"
  }
]

const testLabelInfoInput = {
  title: 'test',
  color: '#fc605f',
  describe: 'Default',
};

describe('Test usePreferences', () => {
  it('Test initialization of usePreferences', () => {
    const { result } = renderHook(() => usePreferences());
  
    // The result is the value after mounting
    expect(result.current.labels[0]).toMatchObject(initLabel[0]);
    expect(result.current.labels[1]).toMatchObject(initLabel[1]);
    expect(result.current.labels[2]).toMatchObject(initLabel[2]);
    expect(result.current.labels[3]).toMatchObject(initLabel[3]);
    expect(result.current.getFocusedLabel()).toMatchObject(initLabel[0]);
    expect(typeof result.current.createLabel).toBe('function');
    expect(typeof result.current.getLabelByID).toBe('function');
    expect(typeof result.current.getFocusedLabel).toBe('function');
    expect(typeof result.current.onSetFocusedLabelID).toBe('function');
  })

  it('Test createLabel function of usePreferences', () => {
    const { result } = renderHook(() => usePreferences());

    act(() => {
      result.current.createLabel(testLabelInfoInput);
    })

    expect(result.current.labels[4]).toMatchObject(createLabelResult[4]);
  })

  // it('Test onSetFocusedLabelID function of usePreferences', () => {
  //   const { result } = renderHook(() => usePreferences());

  //   act(() => {
  //     result.current.onSetFocusedLabelID(
  //       "ba19e9c3d5f49882ddaafed4f286a8a81491150426d321179270e27e74a89097"
  //     );
  //   })

  //   expect(result.current.getFocusedLabel()).toMatchObject(initLabel[2]);
  // })

  // it('Test updateLabel function of usePreferences', () => {
  //   const { result } = renderHook(() => usePreferences());

  //   act(() => {
  //     result.current.createLabel(testLabelInfoInput);
  //   })

  //   expect(result.current.labels).toEqual(createLabelResult);
  // })

  // it('Test getLabelByID function of usePreferences', () => {
  //   const { result } = renderHook(() => usePreferences());

  //   expect(
  //     result.current.getLabelByID(
  //       "ec7d56a01607001e6401366417c5e2eb00ffa0df17ca1a9a831e0b32c8f11bf7"
  //     )).toMatchObject(initLabel[0]);
  // })
})


