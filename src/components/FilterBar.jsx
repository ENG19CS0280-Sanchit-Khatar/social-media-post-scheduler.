import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const controlSx = {
  minWidth: 200,
  "& .MuiOutlinedInput-root": {
    height: 56,
    borderRadius: "8px",
  },
  "& .MuiInputBase-root": {
    height: 56,
    borderRadius: "8px",
  },
  "& .MuiPickersInputBase-root": {
    height: 56,
    borderRadius: "8px",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "8px",
  },
  "& .MuiPickersOutlinedInput-notchedOutline": {
    borderRadius: "8px",
  },
};

const FilterBar = ({
  filterConfig,
  selectedStatus,
  setSelectedStatus,
  selectedPlatform,
  setSelectedPlatform,
  searchTerm,
  setSearchTerm,
  selectedDateRange,
  setSelectedDateRange,
  selectedCustomDate,
  setSelectedCustomDate,
  onResetFilters,
}) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      alignItems: "center",
      justifyContent: "flex-end",
    }}
  >
    <TextField
      label="Search posts"
      placeholder="Search post content"
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
      variant="outlined"
      sx={{ ...controlSx, minWidth: 240 }}
    />
    <FormControl sx={controlSx}>
      <InputLabel id="filter-status-label">Select Status</InputLabel>
      <Select
        id="filter-status"
        labelId="filter-status-label"
        label="Select Status"
        onChange={(event) => setSelectedStatus(event.target.value)}
        value={selectedStatus}
      >
        {filterConfig.statuses.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl sx={controlSx}>
      <InputLabel id="filter-platform-label">Select Platform</InputLabel>
      <Select
        id="filter-platform"
        labelId="filter-platform-label"
        label="Select Platform"
        onChange={(event) => setSelectedPlatform(event.target.value)}
        value={selectedPlatform}
      >
        {filterConfig.platforms.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <FormControl sx={controlSx}>
      <InputLabel id="filter-date-range-label">Group By Date</InputLabel>
      <Select
        id="filter-date-range"
        labelId="filter-date-range-label"
        label="Group By Date"
        onChange={(event) => setSelectedDateRange(event.target.value)}
        value={selectedDateRange}
      >
        {filterConfig.dateRanges.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {selectedDateRange === "custom" && (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select date"
          value={selectedCustomDate ? dayjs(selectedCustomDate) : null}
          onChange={(date) =>
            setSelectedCustomDate(
              date?.isValid() ? date.format("YYYY-MM-DD") : "",
            )
          }
          slotProps={{
            textField: {
              variant: "outlined",
              sx: controlSx,
            },
          }}
        />
      </LocalizationProvider>
    )}
    <Tooltip title="Reset filters">
      <IconButton
        aria-label="Reset filters"
        onClick={onResetFilters}
        sx={{
          width: 56,
          height: 56,
          borderRadius: "8px",
          border: "1px solid rgba(0, 0, 0, 0.23)",
        }}
      >
        <RestartAltOutlinedIcon />
      </IconButton>
    </Tooltip>
  </div>
);

export default FilterBar;
