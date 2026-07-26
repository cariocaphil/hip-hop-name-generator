import { fireEvent, render, screen } from '@testing-library/react';
import NameForm from './NameForm';

describe('NameForm', () => {
  test('renders form fields and submit button', () => {
    render(<NameForm onFormSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/real name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/further information/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/choose a prefix/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate new name/i })).toBeInTheDocument();
  });

  test('defaults prefix to Lil', () => {
    render(<NameForm onFormSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/choose a prefix/i)).toHaveValue('Lil');
  });

  test('submits name, additional info, and prefix', () => {
    const onFormSubmit = jest.fn();
    render(<NameForm onFormSubmit={onFormSubmit} />);

    fireEvent.change(screen.getByLabelText(/real name/i), { target: { value: 'Alex' } });
    fireEvent.change(screen.getByLabelText(/further information/i), {
      target: { value: 'loves jazz' },
    });
    fireEvent.change(screen.getByLabelText(/choose a prefix/i), { target: { value: 'MC' } });
    fireEvent.click(screen.getByRole('button', { name: /generate new name/i }));

    expect(onFormSubmit).toHaveBeenCalledTimes(1);
    expect(onFormSubmit).toHaveBeenCalledWith('Alex', 'loves jazz', 'MC');
  });

  test('allows submitting with no prefix', () => {
    const onFormSubmit = jest.fn();
    render(<NameForm onFormSubmit={onFormSubmit} />);

    fireEvent.change(screen.getByLabelText(/real name/i), { target: { value: 'Sam' } });
    fireEvent.change(screen.getByLabelText(/choose a prefix/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /generate new name/i }));

    expect(onFormSubmit).toHaveBeenCalledWith('Sam', '', '');
  });
});
