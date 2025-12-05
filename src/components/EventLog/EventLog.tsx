import React from 'react';
import {
  Drawer,
  Paper,
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { History, Close } from '@mui/icons-material';
import { useEventLog } from '../../hooks/useEventLog';

import TrashIcon from '../../assets/icons/TrashIcon.svg';

interface EventLogProps {
  open: boolean;
  onClose: () => void;
}

export const EventLog: React.FC<EventLogProps> = ({ open, onClose }) => {
  const { events, clearEvents } = useEventLog();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: 400, maxWidth: '90vw' } }}
    >
      <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} elevation={0}>
        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History /> Журнал событий
          </Typography>

          <Box>
            <IconButton aria-label="Очистить журнал" onClick={clearEvents} size="small" title="Очистить журнал">
              <img src={TrashIcon} alt="Очистить" width={18} height={18} />
            </IconButton>

            {/* кнопка закрытия */}
            <IconButton aria-label="Закрыть" onClick={onClose} size="small" title="Закрыть">
              <Close />
            </IconButton>
          </Box>
        </Box>

        <List sx={{ flex: 1, overflow: 'auto' }}>
          {events.length === 0 ? (
            <ListItem>
              <ListItemText primary="Событий пока нет" secondary="Действия с питомцами появятся здесь" />
            </ListItem>
          ) : (
            events.map((event, index) => (
              <ListItem divider key={index}>
                <ListItemText
                  primary={event}
                  primaryTypographyProps={{ fontSize: '0.875rem', sx: { wordBreak: 'break-word' } }}
                />
              </ListItem>
            ))
          )}
        </List>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Всего событий: {events.length}
          </Typography>
        </Box>
      </Paper>
    </Drawer>
  );
};
