import { act, renderHook } from '@testing-library/react-hooks/dom';
import { usePage } from '../renderer/stores/page_store';
import request from '../renderer/request';

const mockResp = {
  name: 'SELECT_FOLDER',
  contents: [
    {
      name: 'Screen_Shot_2020-12-02_at_1.08.59_PM.png',
      src: '/Users/zhangjinzhe/20210906_121323/images/Screen_Shot_2020-12-02_at_1.08.59_PM.png',
      dir: '/Users/zhangjinzhe/20210906_121323/images',
    },
    {
      name: 'diagram (1).png',
      src: '/Users/zhangjinzhe/20210906_121323/images/diagram (1).png',
      dir: '/Users/zhangjinzhe/20210906_121323/images',
    },
  ],
};

const mockPages = [
  {
    key: '/441010f7c25f56f2ec2e39c2a9f53ae9e017a15e0f4f8c58e86e8169e524b0a8',
    name: 'Screen_Shot_2020-12-02_at_1.08.59_PM.png',
    src: '/Users/zhangjinzhe/20210906_121323/images/Screen_Shot_2020-12-02_at_1.08.59_PM.png',
    type: 'image',
    tags: [],
  },
  {
    key: '/5c0e13d38c1ecd4e898a32b1543677c9912f42cdea674555b980aa688a295aa4',
    name: 'diagram (1).png',
    src: '/Users/zhangjinzhe/20210906_121323/images/diagram (1).png',
    type: 'image',
    tags: [],
  },
];

const mockImport = [
  {
    key: '/6bd7b1e04b8bc1757da930bed1adca726c208591d6022d7139422008268f3e5e',
    name: "Frame 1 (1).jpg",
    src: "/Users/zhangjinzhe/Downloads/Frame 1 (1).jpg",
    type: 'image',
    tags: [],
  },
  {
    key: "/a0b568267fd7036c26a293e3a135da674ef1de5b847ebe3088e8b61ed5a9b79a",
    name: "IMG_3030.PNG",
    src: "/Users/zhangjinzhe/Downloads/IMG_3030.PNG",
    type: 'image',
    tags: [],
  },
];

const updatedPage = {
  key: '/441010f7c25f56f2ec2e39c2a9f53ae9e017a15e0f4f8c58e86e8169e524b0a8',
  name: 'Screen_Shot_2020-12-02_at_1.08.59_PM.png',
  src: '/Users/zhangjinzhe/20210906_121323/images/Screen_Shot_2020-12-02_at_1.08.59_PM.png',
  type: 'image',
  tags: ['fffff'],
};

jest.mock('../renderer/request', () => ({
  receive: jest.fn(() => null),
  removeListener: jest.fn(() => null),
  selectFolder: jest.fn(() => null),
}));

afterEach(() => {
  jest.clearAllMocks();
})

test('test initialize', () => {
  const { result } = renderHook(() => usePage({
    workingPath: 'test',
    setWorkingPath: () => null,
  }));

  // Get init workingPath page
  act(() => {
    result.current.generalListener('', mockResp);
  });

  expect(request.selectFolder.mock.calls.length).toBe(1);
  expect(result.current.pages).toEqual(mockPages);
});

test('test import pages function', () => {
  const { result } = renderHook(() => usePage({
    workingPath: 'test',
    setWorkingPath: () => null,
  }));

  // Get init workingPath page
  act(() => {
    result.current.generalListener('', mockResp);
  });

  expect(result.current.pages).toEqual(mockPages);

  // import zip file(replace the page list with imported pages)
  act(() => {
    result.current.addPages(mockImport);
  });

  expect(result.current.pages).toEqual(mockImport);
});

test('test onUpdate', () => {
  const { result } = renderHook(() => usePage({
    workingPath: 'test',
    setWorkingPath: () => null,
  }));

  // Get init workingPath page
  act(() => {
    result.current.generalListener('', mockResp);
  });

  act(() => {
    result.current.onUpdatePage(updatedPage);
  });

  expect(result.current.pages[0]).toEqual(updatedPage);
});
