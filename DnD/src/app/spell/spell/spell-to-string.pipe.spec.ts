import { SpellToStringPipe } from './spell-to-string.pipe';

describe('SpellToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new SpellToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
