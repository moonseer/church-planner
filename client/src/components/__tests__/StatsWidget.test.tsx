import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsWidget from '../StatsWidget';

describe('StatsWidget Component', () => {
  const mockStats = [
    { id: '1', label: 'Attendance', value: 120, change: 5, changeType: 'increase' as const },
    { id: '2', label: 'Volunteers', value: 25, change: 2, changeType: 'increase' as const },
  ];

  it('renders stats correctly', () => {
    render(<StatsWidget stats={mockStats} />);
    
    // Check if stats are rendered
    expect(screen.getByText('Attendance')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('Volunteers')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('renders change indicators correctly', () => {
    render(<StatsWidget stats={mockStats} />);
    
    // Check for change indicators
    expect(screen.getByText(/5% from last month/)).toBeInTheDocument();
    expect(screen.getByText(/2% from last month/)).toBeInTheDocument();
  });

  it('renders empty state when no stats are provided', () => {
    const { container } = render(<StatsWidget stats={[]} />);
    // The component doesn't actually render a "No statistics available" message
    // It just renders an empty grid
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeInTheDocument();
    expect(gridElement?.children.length).toBe(0);
  });
}); 