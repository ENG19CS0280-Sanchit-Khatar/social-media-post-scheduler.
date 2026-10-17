import React, { useEffect, useState } from "react";
import mockPosts from "../data/mockPosts.json";
import noPreviewImage from "../assets/no-preview.png";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TablePagination,
  Tooltip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterBar from "./FilterBar";

const PLATFORM_LABELS = {
  x: "X",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
};

const PLATFORM_COLORS = {
  x: { outline: "#000000", background: "#D9D9D9" },
  facebook: { outline: "#1877F2", background: "#C9DDFB" },
  instagram: { outline: "#5851db", background: "#D8D5F5" },
  tiktok: { outline: "#E4405F", background: "#F8CDD6" },
};

const STATUS_COLORS = {
  failed: { outline: "#B71C1C", background: "#FF8A80" },
  published: { outline: "#2E7D32", background: "#C8E6C9" },
  scheduled: { outline: "#1976D2", background: "#C8DCF5" },
};

const TABLE_COLUMNS = [
  { id: "id", label: "Post ID", minWidth: 220 },
  { id: "content", label: "Post Content", minWidth: 220 },
  { id: "platform", label: "Platform", minWidth: 100 },
  { id: "scheduledTime", label: "Scheduled For", minWidth: 150 },
  { id: "status", label: "Status", minWidth: 120 },
  { id: "actions", label: "Actions", minWidth: 120, align: "right" },
];

const FILTER_CONFIG = {
  platforms: [
    { label: "All Platforms", value: "all" },
    { label: "X", value: "x" },
    { label: "Instagram", value: "instagram" },
    { label: "Facebook", value: "facebook" },
    { label: "TikTok", value: "tiktok" },
  ],
  statuses: [
    { label: "All Statuses", value: "all" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Published", value: "published" },
    { label: "Failed", value: "failed" },
  ],
  dateRanges: [
    { label: "All Time", value: "all" },
    { label: "Due Today", value: "today" },
    { label: "Due Tomorrow", value: "tomorrow" },
    { label: "Custom Range", value: "custom" },
  ],
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const FILTER_QUERY_PARAMS = [
  "search",
  "status",
  "platform",
  "groupBy",
  "groupByDate",
  "date",
  "page",
  "pageSize",
];

const getInitialFilters = () => {
  const params = new URLSearchParams(window.location.search);
  const statusParam = params.get("status");
  const platformParam = params.get("platform");
  const dateRangeParam = params.get("groupByDate");
  const customDateParam = params.get("date") ?? "";
  const pageParam = Number(params.get("page"));
  const pageSizeParam = Number(params.get("pageSize"));

  return {
    search: params.get("search") ?? "",
    status: FILTER_CONFIG.statuses.some((s) => s.value === statusParam)
      ? statusParam
      : "all",
    platform: FILTER_CONFIG.platforms.some((p) => p.value === platformParam)
      ? platformParam
      : "all",
    dateRange: FILTER_CONFIG.dateRanges.some((d) => d.value === dateRangeParam)
      ? dateRangeParam
      : "all",
    customDate:
      /^\d{4}-\d{2}-\d{2}$/.test(customDateParam) &&
      !Number.isNaN(new Date(`${customDateParam}T00:00:00`).getTime())
        ? customDateParam
        : "",
    page: Number.isInteger(pageParam) && pageParam > 0 ? pageParam - 1 : 0,
    pageSize: PAGE_SIZE_OPTIONS.includes(pageSizeParam) ? pageSizeParam : 10,
  };
};

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatUtcToLocal = (utcString) => {
  const date = new Date(utcString);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const Dashboard = () => {
  const [filters, setFilters] = useState(getInitialFilters);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [brokenImages, setBrokenImages] = useState(() => new Set());

  const {
    search,
    status,
    platform,
    dateRange,
    customDate,
    page: currentPage,
    pageSize,
  } = filters;

  useEffect(() => {
    const handlePopState = () => setFilters(getInitialFilters());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const todayKey = formatDateKey(new Date());
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowKey = formatDateKey(tomorrowObj);

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      !search.trim() ||
      post.content.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = status === "all" || post.status === status;
    const matchesPlatform =
      platform === "all" || post.platforms.includes(platform);

    const postDateKey = formatDateKey(new Date(post.scheduledAt));
    const matchesDate =
      dateRange === "all" ||
      (dateRange === "today" && postDateKey === todayKey) ||
      (dateRange === "tomorrow" && postDateKey === tomorrowKey) ||
      (dateRange === "custom" && (!customDate || postDateKey === customDate));

    return matchesSearch && matchesStatus && matchesPlatform && matchesDate;
  });

  const maxPage = Math.max(0, Math.ceil(filteredPosts.length / pageSize) - 1);
  const activePage = Math.min(currentPage, maxPage);
  const paginatedPosts = filteredPosts.slice(
    activePage * pageSize,
    (activePage + 1) * pageSize,
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const queryValues = {
      search,
      status: status === "all" ? "" : status,
      platform: platform === "all" ? "" : platform,
      groupByDate: dateRange === "all" ? "" : dateRange,
      date: dateRange === "custom" ? customDate : "",
      page: activePage === 0 ? "" : String(activePage + 1),
      pageSize: pageSize === 10 ? "" : String(pageSize),
    };

    Object.entries(queryValues).forEach(([key, val]) => {
      if (val) params.set(key, val);
      else params.delete(key);
    });
    params.delete("groupBy");

    window.history.replaceState(null, "", url);
  }, [search, status, platform, dateRange, customDate, activePage, pageSize]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <FilterBar
        filterConfig={FILTER_CONFIG}
        selectedStatus={status}
        setSelectedStatus={(val) =>
          setFilters((prev) => ({ ...prev, status: val, page: 0 }))
        }
        selectedPlatform={platform}
        setSelectedPlatform={(val) =>
          setFilters((prev) => ({ ...prev, platform: val, page: 0 }))
        }
        searchTerm={search}
        setSearchTerm={(val) =>
          setFilters((prev) => ({ ...prev, search: val, page: 0 }))
        }
        selectedDateRange={dateRange}
        setSelectedDateRange={(val) =>
          setFilters((prev) => ({
            ...prev,
            dateRange: val,
            customDate: "",
            page: 0,
          }))
        }
        selectedCustomDate={customDate}
        setSelectedCustomDate={(val) =>
          setFilters((prev) => ({ ...prev, customDate: val, page: 0 }))
        }
        onResetFilters={() => {
          setFilters({
            search: "",
            status: "all",
            platform: "all",
            dateRange: "all",
            customDate: "",
            page: 0,
            pageSize: 10,
          });
          const url = new URL(window.location.href);
          FILTER_QUERY_PARAMS.forEach((param) =>
            url.searchParams.delete(param),
          );
          window.history.replaceState(null, "", url);
        }}
      />
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {TABLE_COLUMNS.map((col) => (
                  <TableCell key={col.id}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPosts.length ? (
                paginatedPosts.map((post) => {
                  const hasValidMedia =
                    post.mediaUrl && !brokenImages.has(post.mediaUrl);

                  return (
                    <TableRow key={post.id}>
                      <TableCell>{post.id}</TableCell>
                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <div
                            className="post-media-thumbnail"
                            style={{
                              position: "relative",
                              flex: "0 0 30px",
                              width: 30,
                              height: 30,
                            }}
                          >
                            <img
                              src={
                                hasValidMedia ? post.mediaUrl : noPreviewImage
                              }
                              alt={hasValidMedia ? "" : "No preview available"}
                              width={40}
                              height={40}
                              onError={() => {
                                if (post.mediaUrl) {
                                  setBrokenImages((prev) =>
                                    new Set(prev).add(post.mediaUrl),
                                  );
                                }
                              }}
                              style={{
                                display: "block",
                                width: 40,
                                height: 40,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                            <Tooltip title="Preview media">
                              <IconButton
                                aria-label={`Preview media for post ${post.id}`}
                                size="small"
                                onClick={() =>
                                  setSelectedMedia({
                                    url: post.mediaUrl,
                                    unavailable:
                                      !post.mediaUrl ||
                                      brokenImages.has(post.mediaUrl),
                                  })
                                }
                                sx={{
                                  position: "absolute",
                                  inset: 0,
                                  width: 40,
                                  height: 40,
                                  p: 0,
                                  color: "#fff",
                                  backgroundColor: "rgba(0, 0, 0, 0.55)",
                                  opacity: 0,
                                  "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                  },
                                  "&:focus-visible": { opacity: 1 },
                                  ".post-media-thumbnail:hover &": {
                                    opacity: 1,
                                  },
                                }}
                              >
                                <VisibilityOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </div>
                          <span>{post.content}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.platforms.map((p, idx) => (
                          <Chip
                            key={idx}
                            label={
                              PLATFORM_LABELS[p] ??
                              p.charAt(0).toUpperCase() + p.slice(1)
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              backgroundColor:
                                PLATFORM_COLORS[p]?.background ?? "#F2F2F2",
                              borderColor:
                                PLATFORM_COLORS[p]?.outline ?? "#757575",
                              color: "#000",
                              padding: "0.2rem 0.3rem",
                              mr: 0.5,
                            }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        {formatUtcToLocal(post.scheduledAt)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            post.status.charAt(0).toUpperCase() +
                            post.status.slice(1)
                          }
                          size="small"
                          variant="outlined"
                          sx={{
                            backgroundColor:
                              STATUS_COLORS[post.status]?.background ??
                              "#F2F2F2",
                            borderColor:
                              STATUS_COLORS[post.status]?.outline ?? "#757575",
                            color: "#000",
                            padding: "0.2rem 0.3rem",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit post">
                          <IconButton
                            aria-label={`Edit post ${post.id}`}
                            size="small"
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete post">
                          <IconButton
                            aria-label={`Delete post ${post.id}`}
                            size="small"
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No posts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredPosts.length}
            page={activePage}
            rowsPerPage={pageSize}
            rowsPerPageOptions={PAGE_SIZE_OPTIONS}
            onPageChange={(_, newPage) =>
              setFilters((prev) => ({ ...prev, page: newPage }))
            }
            onRowsPerPageChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                page: 0,
                pageSize: Number(event.target.value),
              }))
            }
          />
        </TableContainer>
      </div>
      <Dialog
        open={Boolean(selectedMedia)}
        onClose={() => setSelectedMedia(null)}
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1,
          }}
        >
          Media preview
          <IconButton
            aria-label="Close media preview"
            onClick={() => setSelectedMedia(null)}
            size="small"
          >
            <CloseOutlinedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 1, "&:first-of-type": { pt: 1 } }}>
          {selectedMedia && (
            <img
              src={
                selectedMedia.unavailable ? noPreviewImage : selectedMedia.url
              }
              alt={
                selectedMedia.unavailable
                  ? "No preview available"
                  : "Post media preview"
              }
              onError={() => {
                setSelectedMedia((curr) =>
                  curr ? { ...curr, unavailable: true } : curr,
                );
              }}
              style={{
                display: "block",
                maxWidth: "min(80vw, 900px)",
                maxHeight: "75vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
