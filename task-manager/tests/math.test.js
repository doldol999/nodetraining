const { calculatTip } = require('../src/math');

test('Should calculate total with tip',() => {
    const total = calculatTip(10,.3);
    expect(total).toBe(13);
});

test('Should calculate total with default tip',() => {
    const total = calculatTip(10);
    expect(total).toBe(12.5);
});