import React, { useState, useEffect, useRef } from 'react';
// AgGridReact is used to render the grid
import { AgGridReact } from 'ag-grid-react';
// axios is used to fetch data from the API
import axios from 'axios';
// import the ag-grid css
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import './App.css';

function App() {
  const [rowData, setRowData] = useState([]);
  const [url, setUrl] = useState('https://swapi.dev/api/people/');
  const gridRef = useRef();

  useEffect(() => {
    // the active variable is used to avoid the race condition when fetching data
    let active = true;

    // if the url is not null, fetch the data
    if (url !== null) {
      axios.get(url)
        .then(res => {
          // if the component is active, update the data and the url
          if (active) {
            setRowData(rowData => [...rowData, ...res.data.results]);
            setUrl(res.data.next);
          }
        })
        .catch(err => console.log(err));
    }
    // clean up function to avoid duplicate updates
    return () => {
      active = false;
    };
    // once the url changes, the useEffect will be called again
  }, [url]);

  //filter options for the grid
  var textfilterParams = {
    filterOptions: ['contains', 'notContains', 'equals', 'notEqual'],
    buttons: ['reset', 'apply']
  };

  var numberfilterParams = {
    filterOptions: ['equals', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual', 'inRange'],
    buttons: ['reset', 'apply']
  };

  // column definitions for the grid
  const columnDefs = [
    { headerName: 'Name', field: 'name', filterParams: textfilterParams },
    { headerName: 'Birth Year', field: 'birth_year', filterParams: textfilterParams },
    { headerName: 'Eye Color', field: 'eye_color', filterParams: textfilterParams },
    { headerName: 'Gender', field: 'gender', filterParams: textfilterParams },
    { headerName: 'Hair Color', field: 'hair_color', filterParams: textfilterParams },
    { headerName: 'Height', field: 'height', filterParams: numberfilterParams },
    { headerName: 'Mass', field: 'mass', filterParams: numberfilterParams },
    { headerName: 'Skin Color', field: 'skin_color', filterParams: textfilterParams },
  ];

  // default column definitions for the grid
  const defaultColDef = {
    flex: 1,
    filter: true,
    sortable: true,
  };

  // function to handle the grid ready event and bind the gridApi
  const onGridReady = (params) => {
    gridRef.current = params.api;
  };

  // function to handle the quick filter text change
  const onQuickFilterTextChange = (e) => {
    gridRef.current.setQuickFilter(e.target.value);
  };

  return (
    <div id="container">
      <input type="text" placeholder="Enter the keywords to quick filter the data" onChange={onQuickFilterTextChange} style={{}}/>
      <div className="ag-theme-alpine" style={{ height: 650, width: "90%", margin:"auto"}}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rowData}
          pagination={true}
          paginationPageSize={20}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}

export default App;
