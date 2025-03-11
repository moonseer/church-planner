import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ServiceCard from '../ServiceCard';
import { BrowserRouter } from 'react-router-dom';

describe('ServiceCard Component', () => {
  const mockService = {
    _id: 'service123',
    title: 'Sunday Service',
    date: new Date('2023-06-01').toISOString(),
    description: 'Regular Sunday service',
    teams: ['worship', 'tech'],
  };

  const mockOnDelete = vi.fn();

  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders service details correctly', () => {
    renderWithRouter(
      <ServiceCard service={mockService} onDelete={mockOnDelete} />
    );

    // Check if service title is displayed
    expect(screen.getByText('Sunday Service')).toBeInTheDocument();
    
    // Check if date is formatted and displayed
    expect(screen.getByText(/June 1, 2023/i)).toBeInTheDocument();
    
    // Check if description is displayed
    expect(screen.getByText('Regular Sunday service')).toBeInTheDocument();
    
    // Check if teams are displayed
    expect(screen.getByText(/worship/i)).toBeInTheDocument();
    expect(screen.getByText(/tech/i)).toBeInTheDocument();
  });

  it('navigates to service details when View button is clicked', () => {
    renderWithRouter(
      <ServiceCard service={mockService} onDelete={mockOnDelete} />
    );

    // Find the View button
    const viewButton = screen.getByRole('button', { name: /view/i });
    expect(viewButton).toBeInTheDocument();
    
    // We can't fully test navigation in this unit test, but we can check if the link is correct
    const linkElement = viewButton.closest('a');
    expect(linkElement).toHaveAttribute('href', `/services/${mockService._id}`);
  });

  it('navigates to edit page when Edit button is clicked', () => {
    renderWithRouter(
      <ServiceCard service={mockService} onDelete={mockOnDelete} />
    );

    // Find the Edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    expect(editButton).toBeInTheDocument();
    
    // Check if the link is correct
    const linkElement = editButton.closest('a');
    expect(linkElement).toHaveAttribute('href', `/services/edit/${mockService._id}`);
  });

  it('calls onDelete when Delete button is clicked and confirmed', () => {
    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);
    
    renderWithRouter(
      <ServiceCard service={mockService} onDelete={mockOnDelete} />
    );

    // Find the Delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
    
    // Click the delete button
    fireEvent.click(deleteButton);
    
    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalled();
    
    // Check if onDelete was called with the correct service ID
    expect(mockOnDelete).toHaveBeenCalledWith(mockService._id);
    
    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('does not call onDelete when Delete button is clicked but not confirmed', () => {
    // Mock window.confirm to return false
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => false);
    
    renderWithRouter(
      <ServiceCard service={mockService} onDelete={mockOnDelete} />
    );

    // Find the Delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    
    // Click the delete button
    fireEvent.click(deleteButton);
    
    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalled();
    
    // Check that onDelete was NOT called
    expect(mockOnDelete).not.toHaveBeenCalled();
    
    // Restore original confirm
    window.confirm = originalConfirm;
  });
});