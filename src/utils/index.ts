export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  return `${currency} ${amount.toLocaleString('en-IN')}`;
};

export const formatCompactNumber = (num: number): string => {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + 'Cr';
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + 'L';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export const formatDate = (dateString: string): string => {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    const now = new Date();
    const d = new Date(dateString);
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) {
      const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      return `${diffMins}m ago`;
    }
    if (diffHrs < 24) {
      return `${diffHrs}h ago`;
    }
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return formatDate(dateString);
  } catch {
    return dateString;
  }
};
