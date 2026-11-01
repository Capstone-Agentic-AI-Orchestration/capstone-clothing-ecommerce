import { fireEvent, render, screen, within } from '@testing-library/react';

import { App } from '../../src/App';

describe('storefront shopping flow', () => {
  it('filters products by category, opens details, and returns to the selected collection', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Tops' }));
    expect(screen.getByRole('button', { name: 'Tops' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('Everyday Overshirt')).toBeTruthy();
    expect(screen.getByText('Studio Knit')).toBeTruthy();
    expect(screen.queryByText('The Solstice Coat')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'View Everyday Overshirt' }));
    expect(screen.getByRole('heading', { name: 'Everyday Overshirt' })).toBeTruthy();
    expect(screen.getByText(/Organic cotton twill/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '← Back to collection' }));
    expect(screen.getByRole('button', { name: 'Tops' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('Everyday Overshirt')).toBeTruthy();
    expect(screen.queryByText('The Solstice Coat')).toBeNull();
  });

  it('adds products, updates quantities and totals, removes lines, and shows a zero-total empty bag', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Add The Solstice Coat to bag' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add The Solstice Coat to bag' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add Everyday Overshirt to bag' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open bag, 3 items' }));

    expect(screen.getByText('The Solstice Coat')).toBeTruthy();
    expect(screen.getByText('Everyday Overshirt')).toBeTruthy();
    expect(screen.getByLabelText('Bag subtotal').textContent).toBe('$624.00');
    const addedCoatLine = screen.getByText('The Solstice Coat').closest('article');
    expect(addedCoatLine).not.toBeNull();
    expect(within(addedCoatLine as HTMLElement).getByText('2')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity of The Solstice Coat' }));
    expect(screen.getByLabelText('Bag subtotal').textContent).toBe('$872.00');
    fireEvent.click(screen.getByRole('button', { name: 'Decrease quantity of The Solstice Coat' }));
    expect(screen.getByLabelText('Bag subtotal').textContent).toBe('$624.00');

    const coatLine = screen.getByText('The Solstice Coat').closest('article');
    expect(coatLine).not.toBeNull();
    fireEvent.click(within(coatLine as HTMLElement).getByRole('button', { name: 'Remove' }));
    expect(screen.getByLabelText('Bag subtotal').textContent).toBe('$128.00');

    const shirtLine = screen.getByText('Everyday Overshirt').closest('article');
    expect(shirtLine).not.toBeNull();
    fireEvent.click(within(shirtLine as HTMLElement).getByRole('button', { name: 'Remove' }));
    expect(screen.getByText('Your bag is taking a breather.')).toBeTruthy();
    expect(screen.getByLabelText('Bag subtotal').textContent).toBe('$0.00');
  });

  it('validates required fields and email, then displays a client-side demo confirmation', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Add The Solstice Coat to bag' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open bag, 1 item' }));
    fireEvent.click(screen.getByRole('button', { name: /Continue to checkout/ }));

    fireEvent.click(screen.getByRole('button', { name: /Place demo order/ }));
    expect(screen.getByText('Enter your full name.')).toBeTruthy();
    expect(screen.getByText('Enter your email address.')).toBeTruthy();
    expect(screen.getByText('Enter a shipping address.')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Avery Rivera' } });
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'avery-at-example' } });
    fireEvent.change(screen.getByLabelText('Shipping address'), { target: { value: '12 Cedar Lane' } });
    fireEvent.click(screen.getByRole('button', { name: /Place demo order/ }));
    expect(screen.getByText('Enter a valid email address.')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'avery@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Place demo order/ }));

    expect(screen.getByRole('heading', { name: 'Demo order confirmed.' })).toBeTruthy();
    expect(screen.getByText('Thank you, Avery Rivera.')).toBeTruthy();
    expect(screen.getByText(/No payment was processed/)).toBeTruthy();
    expect(screen.getByLabelText('Confirmed total').textContent).toBe('$248.00');
    expect(screen.getByText('The Solstice Coat')).toBeTruthy();
  });
});
