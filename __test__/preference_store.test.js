import { act, renderHook } from '@testing-library/react-hooks/dom';
import { usePreferences  } from "../renderer/stores/preferences_store";

const initLabel = [
  {
    "key":"ec7d56a01607001e6401366417c5e2eb00ffa0df17ca1a9a831e0b32c8f11bf7",
    "title":"Blue",
    "color":"#57acf5",
    "describe":"Default"
  },{
    "key":"d486dfbd5fb578340bccbdd0a662527eab38550648d5f44517e5ac71b8824703",
    "title":"Green",
    "color":"#34c84a",
    "describe":"Default"
  },{
    "key":"ba19e9c3d5f49882ddaafed4f286a8a81491150426d321179270e27e74a89097",
    "title":"Red",
    "color":"#fc605b",
    "describe":"Default"
  },{
    "key":"19dd83f117525b931fccdafe808aaa6939af792ee549f359eff13fac0d622f5d",
    "title":"Yellow",
    "color":"#fdbc40",
    "describe":"normal"
  }
]

const createLabelResult = [
  {
    "key":"ec7d56a01607001e6401366417c5e2eb00ffa0df17ca1a9a831e0b32c8f11bf7",
    "title":"Blue",
    "color":"#57acf5",
    "describe":"Default"
  },{
    "key":"d486dfbd5fb578340bccbdd0a662527eab38550648d5f44517e5ac71b8824703",
    "title":"Green",
    "color":"#34c84a",
    "describe":"Default"
  },{
    "key":"ba19e9c3d5f49882ddaafed4f286a8a81491150426d321179270e27e74a89097",
    "title":"Red",
    "color":"#fc605b",
    "describe":"Default"
  },{
    "key":"19dd83f117525b931fccdafe808aaa6939af792ee549f359eff13fac0d622f5d",
    "title":"Yellow",
    "color":"#fdbc40",
    "describe":"normal"
  },{
    "key":"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
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
    expect(result.current.labels).toEqual(initLabel);
    expect(result.current.getFocusedLabel()).toEqual(initLabel[0]);
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

    expect(result.current.labels).toEqual(createLabelResult);
  })

  it('Test onSetFocusedLabelID function of usePreferences', () => {
    const { result } = renderHook(() => usePreferences());

    act(() => {
      result.current.onSetFocusedLabelID(
        "ba19e9c3d5f49882ddaafed4f286a8a81491150426d321179270e27e74a89097"
      );
    })

    expect(result.current.getFocusedLabel()).toEqual(initLabel[2]);
  })

  it('Test updateLabel function of usePreferences', () => {
    const { result } = renderHook(() => usePreferences());

    act(() => {
      result.current.createLabel(testLabelInfoInput);
    })

    expect(result.current.labels).toEqual(createLabelResult);
  })

  it('Test getLabelByID function of usePreferences', () => {
    const { result } = renderHook(() => usePreferences());

    expect(
      result.current.getLabelByID(
        "ec7d56a01607001e6401366417c5e2eb00ffa0df17ca1a9a831e0b32c8f11bf7"
      )).toEqual(initLabel[0]);
  })
})


