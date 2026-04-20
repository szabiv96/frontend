import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

vi.mock('./api', () => ({
  fetchJson: vi.fn(),
}));

const { fetchJson } = await import('./api');

const bootstrapPayload = {
  posts: [
    {
      _id: 'post-1',
      _rev: 'rev-1',
      title: 'Latest Thought',
      _createdAt: '2026-04-20T18:00:00.000Z',
      publishedAt: '2026-04-20T18:00:00.000Z',
      author: { _ref: 'author-1' },
      mainImageUrl: '/img/landingPagePic01.png',
      body: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'This is the lead article body.' }],
        },
      ],
    },
    {
      _id: 'post-2',
      _rev: 'rev-2',
      title: 'Another Thought',
      _createdAt: '2026-04-19T18:00:00.000Z',
      author: { _ref: 'author-1' },
      mainImageUrl: '/img/landingPagePic02.png',
      body: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Backup article body.' }],
        },
      ],
    },
  ],
  cvDatas: [
    {
      _id: 'cv-1',
      exhibitions: [
        {
          year: '2025',
          title: 'Test Exhibition',
          space: 'Main Hall',
          place: 'Budapest',
        },
      ],
      educations: [
        {
          startYear: '2018',
          finishYear: '2022',
          inst: 'Art Academy',
          department: 'Painting',
        },
      ],
      Projects: [
        {
          year: '2026',
          name: 'Portfolio Project',
          link: 'https://example.com',
          genre: 'Web',
        },
      ],
    },
  ],
  pictures: [
    {
      _id: 'album-1',
      collectionName: 'Album One',
      description: 'Album description',
      coverImageUrl: '/img/landingPagePic03.png',
      imageGallery: [{ _key: 'img-1', url: '/img/landingPagePic04.png' }],
    },
  ],
  authors: [{ _id: 'author-1', name: 'Author One' }],
};

describe('App bootstrap flow', () => {
  beforeEach(() => {
    fetchJson.mockReset();
    fetchJson.mockResolvedValue(bootstrapPayload);
  });

  it('renders gallery data after the bootstrap request resolves', async () => {
    render(
      <MemoryRouter
        initialEntries={['/gallery']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading portfolio')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Album One')).toBeInTheDocument();
    });

    expect(fetchJson).toHaveBeenCalledWith('/api/bootstrap', expect.any(Object));
  });

  it('renders an error state when bootstrap loading fails', async () => {
    fetchJson.mockRejectedValueOnce(new Error('Broken bootstrap'));

    render(
      <MemoryRouter
        initialEntries={['/']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Unable to load portfolio data')).toBeInTheDocument();
    });

    expect(screen.getByText('Broken bootstrap')).toBeInTheDocument();
  });

  it('renders a direct /quit/:postId route from the bootstrap payload', async () => {
    render(
      <MemoryRouter
        initialEntries={['/quit/rev-1']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Latest Thought' })).toBeInTheDocument();
    });

    expect(screen.getByText('Author One')).toBeInTheDocument();
    expect(screen.getByText('This is the lead article body.')).toBeInTheDocument();
  });

  it('renders the CV route from the bootstrap payload', async () => {
    render(
      <MemoryRouter
        initialEntries={['/cv']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Exhibitions' })).toBeInTheDocument();
    });

    expect(screen.getByText('Test Exhibition')).toBeInTheDocument();
    expect(screen.getByText('Art Academy')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Portfolio Project' })).toBeInTheDocument();
  });

  it('renders the home route after bootstrap resolves', async () => {
    render(
      <MemoryRouter
        initialEntries={['/']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Self representational website.')).toBeInTheDocument();
    });

    expect(screen.getByText('Another Thought')).toBeInTheDocument();
    expect(screen.getByText('EXHIBITION HISTORY')).toBeInTheDocument();
  });
});
