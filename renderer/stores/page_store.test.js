/* eslint-disable import/no-named-as-default-member */
import { act, renderHook } from '@testing-library/react-hooks/dom';
import { usePage } from './page_store';
import request from '../request';

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

jest.mock('../request', () => ({
  receive: jest.fn(() => null),
  removeListener: jest.fn(() => null),
  selectFolder: jest.fn(() => null),
}));

it('should use pages', () => {
  const { result } = renderHook(() => usePage({
    workingPath: 'test',
    setWorkingPath: () => null,
  }));

  act(() => {
    result.current.generalListener('', mockResp);
  });

  console.log(result.current.pages);
  expect(request.selectFolder.mock.calls.length).toBe(1);
  expect(result.current.pages).toEqual(mockPages);
  // expect(request.removeListener.mock.calls.length).toBe(1);

  // eslint-disable-next-line import/no-named-as-default-member
  request.receive.mockReset();
  // eslint-disable-next-line import/no-named-as-default-member
  request.removeListener.mockReset();
  request.selectFolder.mockReset();
});
