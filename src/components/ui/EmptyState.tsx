import type { SvgIconComponent } from '@mui/icons-material';
import type { ReactNode } from 'react';

import styles from './EmptyState.module.scss';

interface EmptyStateProps {
  icon: SvgIconComponent;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Icon fontSize="large" />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}