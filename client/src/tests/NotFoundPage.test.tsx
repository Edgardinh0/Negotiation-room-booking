// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFoundPage';

// Мокаем иконку
vi.mock('react-icons/lu', () => ({
  LuHouse: () => <svg data-testid="lu-house-icon" />,
}));

describe('NotFoundPage', () => {
  it('отображает заголовок 404 и информацию об ошибке', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Страница не найдена' })).toBeTruthy();
    expect(
      screen.getByText('Запрашиваемая страница не существует, была удалена или перенесена на другой адрес.')
    ).toBeTruthy();
  });

  it('содержит ссылку для перехода к переговорным с правильным атрибутом href', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const linkElement = screen.getAllByRole('link', { name: /вернуться к переговорным/i })[0];

    expect(linkElement).toBeTruthy();
    expect(linkElement.getAttribute('href')).toBe('/rooms');
  });

  it('рендерит иконку дома внутри ссылки', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getAllByTestId('lu-house-icon')[0]).toBeTruthy();
  });
});