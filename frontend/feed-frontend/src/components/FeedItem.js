import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function FeedItem({ item, isLast, lastItemRef }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Card - clickable to open modal */}
      <div 
        ref={isLast ? lastItemRef : null}
        onClick={handleOpen}
        style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
      >
        <h4 style={{ margin: '0 0 8px 0', color: '#1a1a1a', fontSize: '18px' }}>
          {item.title}
        </h4>
        
        <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
          {item.agency} • {item.source}
        </p>
        
        {item.description && (
          <p style={{ fontSize: '14px', color: '#333', margin: '12px 0', lineHeight: '1.5' }}>
            {item.description}
          </p>
        )}
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: '#e7f3ff',
            color: '#0066cc',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {item.topic}
          </span>
          
          {item.deadline && (
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#fff3e0',
              color: '#e65100',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Deadline: {item.deadline}
            </span>
          )}
        </div>
      </div>

      {/* Modal with full details */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="opportunity-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '600px' },
          maxHeight: '80vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: '8px',
          p: 4,
        }}>
          {/* Close button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Content */}
          <Typography id="opportunity-modal-title" variant="h5" component="h2" sx={{ mb: 2, pr: 4 }}>
            {item.title}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Chip label={item.topic} color="primary" size="small" sx={{ mr: 1 }} />
            <Chip label={item.source} variant="outlined" size="small" />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Agency:</strong> {item.agency}
          </Typography>

          {item.description && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {item.description}
            </Typography>
          )}

          {item.date && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Posted:</strong> {item.date}
            </Typography>
          )}

          {item.deadline && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Deadline:</strong> {item.deadline}
            </Typography>
          )}

          {item.awardAmount && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Award Amount:</strong> {item.awardAmount}
            </Typography>
          )}

          {item.solicitationNumber && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Solicitation Number:</strong> {item.solicitationNumber}
            </Typography>
          )}

          {/* Action buttons */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            {item.link && item.link !== '#' && (
              <Button 
                variant="contained" 
                href={item.link} 
                target="_blank" 
                rel="noreferrer"
              >
                View on {item.source}
              </Button>
            )}
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}