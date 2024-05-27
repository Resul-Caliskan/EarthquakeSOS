import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function createData(id, title, description, time, audioUrl) {
  return {
    id,
    title,
    description,
    time,
    audioUrl,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>{row.time}</TableCell>
        <TableCell>
          {row.audioUrl && (
            <audio controls>
              <source src={row.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detaylar
              </Typography>
              <Typography>{row.description}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    audioUrl: PropTypes.string,
  }).isRequired,
};

const rows = [
  createData(1, 'Yardım Çağrısı 1', 'Açıklama 1', '2024-05-27T12:00:00Z', 'https://example.com/audio1.mp3'),
  createData(2, 'Yardım Çağrısı 2', 'Açıklama 2', '2024-05-27T12:30:00Z', 'https://example.com/audio2.mp3'),
  // Daha fazla veri eklenebilir
];

export default function ListComponent() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Çağrı Başlığı</TableCell>
            <TableCell>Açıklama</TableCell>
            <TableCell>Zaman</TableCell>
            <TableCell>Ses Kaydı</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
