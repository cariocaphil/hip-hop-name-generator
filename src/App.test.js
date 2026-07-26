import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import generateHipHopName from './HipHopName';

jest.mock('./HipHopName');
jest.mock('./images/dancer.png', () => 'dancer.png');

describe('App', () => {
  beforeEach(() => {
    generateHipHopName.mockReset();
  });

  test('renders title, description, and wikipedia link', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /hip hop name generator/i })).toBeInTheDocument();
    expect(
      screen.getByText(/unhappy with how your friends or colleagues call you/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /explore hip hop artist names on wikipedia/i })
    ).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Hip_hop_artists');
  });

  test('shows generated name after successful form submit', async () => {
    let resolveName;
    generateHipHopName.mockReturnValue(
      new Promise((resolve) => {
        resolveName = resolve;
      })
    );

    render(<App />);

    fireEvent.change(screen.getByLabelText(/real name/i), { target: { value: 'Alex' } });
    fireEvent.click(screen.getByRole('button', { name: /generate new name/i }));

    await waitFor(() => {
      expect(generateHipHopName).toHaveBeenCalledWith('Alex', '', 'Lil');
    });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await act(async () => {
      resolveName({ ok: true, hipHopName: 'MC Shadow' });
    });

    expect(screen.getByText(/your hip hop name is: mc shadow/i)).toBeInTheDocument();
  });

  test('shows alert when name generation fails', async () => {
    generateHipHopName.mockResolvedValue({
      ok: false,
      error: 'Unable to generate a name right now. Please try again.',
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/real name/i), { target: { value: 'Alex' } });
    fireEvent.click(screen.getByRole('button', { name: /generate new name/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /unable to generate a name right now/i
    );
  });
});
