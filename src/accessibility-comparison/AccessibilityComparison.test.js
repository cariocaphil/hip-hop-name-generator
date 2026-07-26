import { fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import generateHipHopName from '../HipHopName';

jest.mock('../HipHopName');
jest.mock('../images/dancer.png', () => 'dancer.png');

describe('accessibility comparison mode', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    generateHipHopName.mockReset();
    window.history.replaceState(null, '', '/');
    document.documentElement.setAttribute('lang', 'en');
    document.title = 'Hip Hop Name Generator';
  });

  afterAll(() => {
    window.history.replaceState(null, '', originalLocation.pathname + originalLocation.search);
  });

  const getToggle = () => screen.getByRole('group', { name: /demo comparison/i });

  test('defaults to the after accessibility version', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /hip hop name generator/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /explore hip hop artist names on wikipedia/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/real name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate new name/i })).toBeInTheDocument();
    expect(screen.getByAltText(/dancer illustration/i)).toBeInTheDocument();

    const afterRadio = within(getToggle()).getByRole('radio', { name: /after accessibility/i });
    expect(afterRadio).toBeChecked();
  });

  test('selecting before renders the reconstructed pre-accessibility variant', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('radio', { name: /before accessibility/i }));

    expect(screen.getByRole('heading', { level: 3, name: /hip hop name generator/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/unhappy with how your friends/i);
    expect(screen.queryByRole('link', { name: /explore hip hop artist names/i })).not.toBeInTheDocument();
    expect(screen.getByText(/link: check out the names of hip hop artists on wikipedia/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/real name/i)).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument();
    expect(document.body.dataset.accessibilityVersion).toBe('before');
    expect(document.documentElement.hasAttribute('lang')).toBe(false);
  });

  test('selecting after restores the current accessible variant', () => {
    window.history.replaceState(null, '', '/?accessibility=before');
    render(<App />);

    expect(screen.getByRole('button', { name: /submit form/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: /after accessibility/i }));

    expect(screen.getByRole('heading', { level: 1, name: /hip hop name generator/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore hip hop artist names on wikipedia/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/real name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate new name/i })).toBeInTheDocument();
    expect(document.body.dataset.accessibilityVersion).toBe('after');
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });

  test('persists the selected version in the URL query string', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('radio', { name: /before accessibility/i }));
    expect(window.location.search).toContain('accessibility=before');

    fireEvent.click(screen.getByRole('radio', { name: /after accessibility/i }));
    expect(window.location.search).toContain('accessibility=after');
  });

  test('toggle is keyboard operable and exposes an accessible name', () => {
    render(<App />);

    const beforeRadio = screen.getByRole('radio', { name: /before accessibility/i });
    const afterRadio = screen.getByRole('radio', { name: /after accessibility/i });

    expect(getToggle()).toBeInTheDocument();
    expect(afterRadio).toHaveAccessibleName(/after accessibility/i);
    expect(beforeRadio).toHaveAccessibleName(/before accessibility/i);

    afterRadio.focus();
    expect(afterRadio).toHaveFocus();

    fireEvent.click(beforeRadio);
    expect(beforeRadio).toBeChecked();
    expect(afterRadio).not.toBeChecked();
  });

  test('before API failure has no alert role; after announces with role=alert', async () => {
    generateHipHopName.mockResolvedValue({
      ok: false,
      error: 'Unable to generate a name right now. Please try again.',
    });

    const { unmount } = render(<App />);
    fireEvent.change(screen.getByLabelText(/real name/i), { target: { value: 'Alex' } });
    fireEvent.click(screen.getByRole('button', { name: /generate new name/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /unable to generate a name right now/i
    );
    unmount();

    window.history.replaceState(null, '', '/?accessibility=before');
    render(<App />);
    const [nameInput] = screen.getAllByRole('textbox');
    fireEvent.change(nameInput, { target: { value: 'Alex' } });
    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    expect(
      await screen.findByText(/unable to generate a name right now/i)
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
