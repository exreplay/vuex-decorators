import { assignStates } from '../src/decorators/utils';

console.error = jest.fn();

beforeEach(() => {
  console.error.mockClear();
});

test(`assignStates should throw a error when moduleName is not present`, () => {
    class TestModule {}
    assignStates(TestModule);
    expect(console.error).toHaveBeenCalledTimes(1);
});
