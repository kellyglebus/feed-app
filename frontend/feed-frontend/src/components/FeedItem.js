import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

export default function FeedItem({ item, isLast, lastItemRef }) {
  return (
    <Card 
      ref={isLast ? lastItemRef : null}
      sx={{ 
        marginBottom: 2,
        '&:hover': {
          boxShadow: 3
        }
      }}
    >
      <CardActionArea 
        component="a" 
        href={item.link} 
        target="_blank" 
        rel="noreferrer"
      >
        <CardContent>
          <Typography variant="h6" component="h4" gutterBottom>
            {item.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {item.agency} • {item.source}
          </Typography>
          
          {item.description && (
            <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
              {item.description}
            </Typography>
          )}
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
            <Chip 
              label={item.topic} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
            
            {item.deadline && (
              <Chip 
                label={`Deadline: ${item.deadline}`} 
                size="small" 
                variant="outlined"
              />
            )}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}