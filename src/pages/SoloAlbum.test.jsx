import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import SoloAlbum from './SoloAlbum';

vi.mock('../api', () => ({
  fetchJson: vi.fn(),
}));

const { fetchJson } = await import('../api');

describe('SoloAlbum fallback fetching', () => {
  beforeEach(() => {
    fetchJson.mockReset();
  });

  it('fetches album data when opened directly without bootstrap pictures', async () => {
    fetchJson.mockResolvedValue({
      _id: 'album-direct',
      collectionName: 'Direct Album',
      description: 'Fetched directly',
      imageGallery: [{ _key: 'img-1', url: '/img/landingPagePic05.png' }],
    });

    render(
      <MemoryRouter
        initialEntries={['/gallery/album-direct']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/gallery/:pictureId" element={<SoloAlbum pictures={[]} />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Direct Album')).toBeInTheDocument();
    });

    expect(fetchJson).toHaveBeenCalledWith('/api/pictures/album-direct', expect.any(Object));
  });
});
