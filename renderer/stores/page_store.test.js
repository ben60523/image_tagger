import { renderHook } from '@testing-library/react-hooks/dom';
import { usePage } from './page_store';
import request from '../request';

jest.mock('../request', () => ({
  receive: jest.fn(() => '1'),
  removeListener: jest.fn(() => '1'),
  selectFolder: jest.fn(() => '1'),
}))

it('should use pages', () => {
  const { result } = renderHook(() => usePage({
    workingPath: 'test',
  }));

  expect(request.selectFolder.mock.calls.length).toBe(1);
  expect(request.removeListener.mock.calls.length).toBe(1);
});