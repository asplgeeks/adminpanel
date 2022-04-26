import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Button, Input, Alert, notification, Spin, Tabs, Upload } from "antd";

import DeleteIcon from '@mui/icons-material/Delete';

import FullScreenDialog from './Dailog'
import FilterListIcon from '@mui/icons-material/FilterList';
import API from "@src/api";
import { visuallyHidden } from '@mui/utils';

// filter 
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData('ate Middle English (in the senses ‘expository treatise’ and ‘explanatory note’): from Latin commentum ‘contrivance’ (in late Latin also ‘interpretation’), neuter past participle of comminisci ‘devise’.'),
  createData('ate Middle English (in the senses ‘expository treatise’ and ‘explanatory note’): from Latin commentum ‘contrivance’ (in late Latin also ‘interpretation’), neuter past participle of comminisci ‘devise’.'),
  createData('ate Middle English (in the senses ‘expository treatise’ and ‘explanatory note’): from Latin commentum ‘contrivance’ (in late Latin also ‘interpretation’), neuter past participle of comminisci ‘devise’.'),
  createData('ate Middle English (in the senses ‘expository treatise’ and ‘explanatory note’): from Latin commentum ‘contrivance’ (in late Latin also ‘interpretation’), neuter past participle of comminisci ‘devise’.'),
  createData('ate Middle English (in the senses ‘expository treatise’ and ‘explanatory note’): from Latin commentum ‘contrivance’ (in late Latin also ‘interpretation’), neuter past participle of comminisci ‘devise’.'),
  createData('ate Middle English (in the senses ‘expository treatise’ and ‘explanatory note’): from Latin commentum ‘contrivance’ (in late Latin also ‘interpretation’), neuter past participle of comminisci ‘devise’.'),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Comments',
  },
  // {
  //   id: 'calories',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Calories',
  // },
  // {
  //   id: 'fat',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Fat (g)',
  // },
  // {
  //   id: 'carbs',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Carbs (g)',
  // },
  // {
  //   id: 'protein',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Protein (g)',
  // },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead   component="span"
    style={{
      display: 'block',
      p: 1,
      m: 1,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
      color: (theme) =>
        theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
      // border: '1px solid',
      borderColor: (theme) =>
        theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
      borderRadius: 2,
      fontSize: '0.875rem',
      fontWeight: '700',
    }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
                <TableCell padding="checkbox">
          <DeleteIcon
            color="primary"
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            // checked={rowCount > 0 && numSelected === rowCount}
            // onChange={onSelectAllClick}
            // inputProps={{
            //   'aria-label': 'select all desserts',
            // }}
          />
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, threadList, setValue, value } = props;
  
  // const options = threadList && threadList.map((output, index) => ({label : output.display_name, id: output.threadcategory_id}))

  // const [inputValue, setInputValue] = React.useState('');

  const options = threadList && threadList.map((output, index) => ({label : output.display_name, id: output.id}))

  const [inputValue, setInputValue] = React.useState('');

console.log(inputValue)
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
      }}
    >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
        User Comments
        </Typography>
        <Autocomplete
      disablePortal
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      id="combo-box-demo"
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => {
      return (<TextField {...params} id="filled-basic" variant="filled" label="Filter" />)
         }
     }
    />
        {numSelected < 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Comments(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [getComments, setComments] = React.useState([])
  const [opened, setDialogOpen] = React.useState(false)
  const [threadList, setThread] = React.useState([])
  const [value, setValue] = React.useState({label : 'Thread', id : 1});
const [ ID, setId] = React.useState('')
console.log(value)

console.log("threadList", threadList)
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = getComments && getComments.comments.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

const handleDialogOpen = (detail) => {
  setId(detail.id)
  setDialogOpen(!opened)
}


React.useEffect(() => {
  API.getThredList()
  .then(response => response)
  .then(result => setThread(result && result.data))
  .catch((ex) => {
      // setTableLoading(false);
      notification.error({
          message: ex,
          placement: "bottomRight",
      });
  });
}, [])

  React.useEffect(() => {
    API.postCommetData(value, rowsPerPage, page)
    .then(response => response)
    .then(result => setComments(result && result.data && result.data.comments))
    .catch((ex) => {
        // setTableLoading(false);
        notification.error({
            message: ex,
            placement: "bottomRight",
        });
    });
  }, [value, page])


  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (0 + page) * rowsPerPage - rows.length) : 0;

  return (<div>
    <Box >
      <Paper >
      {opened === true ? <FullScreenDialog ID={ID}/> : ''}
        <EnhancedTableToolbar numSelected={selected.length} threadList={threadList} setValue={setValue} value={value}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 500}}
            aria-label="custom pagination table"
            size={dense ? 'small' : 'medium'}
          >
            {/* <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            /> */}
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {/* {stableSort(getComments, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                {getComments && getComments.map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.comment)}
                      // role="checkbox"
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                      component="span"
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="normal"
                        colSpan={6}
                      >
                        {row.comment}
                      </TableCell>
                      <TableCell
                      //  padding="checkbox"
                       >
                        <DeleteIcon
                          color="secondary"
                          onClick={() => handleDialogOpen(row)}
                          // checked={isItemSelected}
                          // inputProps={{
                          //   'aria-labelledby': labelId,
                          // }}
                          colSpan={6}
                        />
                      </TableCell>
                      {/* <TableCell align="right">{row.comment_by}</TableCell>
                      <TableCell align="right">{row.commentor_designation}</TableCell>
                      <TableCell align="right">{row.first_name}</TableCell>
                      <TableCell align="right">{row.last_name}</TableCell> */}
                    </TableRow>
                  );
                })}
              {/* {emptyRows > 1 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 15, 30]}
          component="div"
          count={getComments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
          {/* <Stack spacing={2}> */}
      <Pagination count={getComments && getComments.length} page={page} onChange={handleChangePage} shape="rounded" style={{float:"right"}}/>
      {/* <Pagination count={10} variant="outlined" shape="rounded" /> */}
    {/* </Stack> */}
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
    </div>);
}


