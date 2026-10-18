import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { addMockPost } from "../data/mockPostStore";

const TikTokIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12.53.02c1.31-.02 2.61-.01 3.92-.02.08 1.53.63 3.03 1.73 4.12 1.1 1.11 2.64 1.62 4.13 1.79v4.03c-1.39-.05-2.78-.34-4.03-.95-.54-.25-1.05-.57-1.56-.89-.01 2.77.01 5.54-.02 8.31-.07 1.33-.51 2.65-1.29 3.73-1.26 1.75-3.45 2.89-5.63 2.93-1.34.08-2.69-.29-3.8-1.05-1.84-1.2-3.1-3.34-3.14-5.55-.02-.5-.03-.99.01-1.49.2-2.13 1.5-4.13 3.34-5.23 2.08-1.26 4.73-1.28 6.83-.06.02 1.48-.04 2.95-.04 4.43-.99-.66-2.24-.96-3.4-.7-.86.2-1.64.75-2.07 1.53-.37.65-.31 1.49.02 2.15.32.71 1.04 1.26 1.82 1.36.59.09 1.21-.04 1.71-.37.75-.5 1.07-1.41 1.05-2.28.05-4.2-.01-8.4.03-12.6z" />
  </SvgIcon>
);

const platformConfig = [
  {
    platform: "Facebook",
    value: "facebook",
    maxCharacterCount: 5000,
    Icon: FacebookIcon,
  },
  {
    platform: "X",
    value: "x",
    maxCharacterCount: 280,
    Icon: XIcon,
  },
  {
    platform: "Instagram",
    value: "instagram",
    maxCharacterCount: 2200,
    Icon: InstagramIcon,
  },
  {
    platform: "TikTok",
    value: "tiktok",
    maxCharacterCount: 2200,
    Icon: TikTokIcon,
  },
];

const PostComposer = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [platformContent, setPlatformContent] = useState({});
  const [summary, setSummary] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [scheduleDate, setScheduleDate] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const selectedPlatformConfigs = platformConfig.filter((platform) =>
    selectedPlatforms.includes(platform.value),
  );
  const isOverLimit = selectedPlatformConfigs.some(
    (platform) =>
      (platformContent[platform.value] ?? "").length >
      platform.maxCharacterCount,
  );
  const isScheduleDateValid =
    scheduleDate?.isValid() && scheduleDate.isAfter(dayjs(), "day");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      selectedPlatforms.length === 0 ||
      !summary.trim() ||
      selectedPlatformConfigs.some(
        (platform) => !platformContent[platform.value]?.trim(),
      ) ||
      isOverLimit ||
      !isScheduleDateValid
    ) {
      return;
    }

    const post = {
      summary: summary.trim(),
      platforms: Object.fromEntries(
        selectedPlatformConfigs.map((platform) => [
          platform.value,
          platformContent[platform.value].trim(),
        ]),
      ),
      scheduledAt: scheduleDate.startOf("day").toISOString(),
      status: "scheduled",
      ...(mediaUrl.trim() ? { mediaUrl: mediaUrl.trim() } : {}),
    };

    try {
      addMockPost(post);
      setPlatformContent({});
      setSummary("");
      setMediaUrl("");
      setSubmitted(true);
      setSubmitError("");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "The post could not be saved.",
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        py: 3,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 680,
          borderRadius: "12px",
          boxShadow: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h5" component="h1" fontWeight={600}>
                Compose a post
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Choose a platform and schedule your post.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <FormControl
                fullWidth
                required
                error={selectedPlatforms.length === 0 && submitted}
              >
                <InputLabel id="compose-platform-label">
                  Select Platform
                </InputLabel>
                <Select
                  multiple
                  id="compose-platform"
                  labelId="compose-platform-label"
                  label="Select Platform"
                  value={selectedPlatforms}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedPlatforms(
                      typeof value === "string" ? value.split(",") : value,
                    );
                    setSubmitted(false);
                    setSubmitError("");
                  }}
                  renderValue={(values) => (
                    <Stack
                      direction="row"
                      spacing={0.75}
                      useFlexGap
                      sx={{ alignItems: "center", flexWrap: "wrap" }}
                    >
                      {values.map((value) => {
                        const platform = platformConfig.find(
                          (item) => item.value === value,
                        );
                        if (!platform) return null;
                        const Icon = platform.Icon;
                        return (
                          <Chip
                            key={value}
                            size="small"
                            icon={<Icon />}
                            label={platform.platform}
                          />
                        );
                      })}
                    </Stack>
                  )}
                >
                  {platformConfig.map(({ platform, value, Icon }) => (
                    <MenuItem key={value} value={value}>
                      <Checkbox checked={selectedPlatforms.includes(value)} />
                      <Icon fontSize="small" sx={{ mr: 1 }} />
                      <ListItemText primary={platform} />
                    </MenuItem>
                  ))}
                </Select>
                {selectedPlatforms.length === 0 && (
                  <FormHelperText>Select one or more platforms.</FormHelperText>
                )}
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Schedule date"
                  value={scheduleDate}
                  minDate={dayjs().add(1, "day").startOf("day")}
                  onChange={(date) => {
                    setScheduleDate(date);
                    setSubmitted(false);
                    setSubmitError("");
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            {selectedPlatforms.length > 0 && (
              <>
                <TextField
                  label="Content summary"
                  placeholder="Add a short summary for this post..."
                  multiline
                  minRows={2}
                  fullWidth
                  required
                  value={summary}
                  onChange={(event) => {
                    setSummary(event.target.value);
                    setSubmitted(false);
                    setSubmitError("");
                  }}
                />

                {selectedPlatformConfigs.map((platform) => {
                  const content = platformContent[platform.value] ?? "";
                  const platformOverLimit =
                    content.length > platform.maxCharacterCount;

                  return (
                    <TextField
                      key={platform.value}
                      label={`${platform.platform} post`}
                      placeholder={`Write your ${platform.platform} post...`}
                      multiline
                      minRows={4}
                      fullWidth
                      required
                      value={content}
                      error={platformOverLimit}
                      onChange={(event) => {
                        setPlatformContent((current) => ({
                          ...current,
                          [platform.value]: event.target.value,
                        }));
                        setSubmitted(false);
                        setSubmitError("");
                      }}
                      helperText={`${content.length} / ${
                        platform.maxCharacterCount
                      } characters${
                        platformOverLimit
                          ? ` — ${
                              content.length - platform.maxCharacterCount
                            } over the limit`
                          : ""
                      }`}
                    />
                  );
                })}

                <TextField
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                  type="url"
                  fullWidth
                  value={mediaUrl}
                  onChange={(event) => {
                    setMediaUrl(event.target.value);
                    setSubmitted(false);
                    setSubmitError("");
                  }}
                />
              </>
            )}

            {submitted && (
              <Alert severity="success">Your post has been scheduled.</Alert>
            )}
            {submitError && <Alert severity="error">{submitError}</Alert>}

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  selectedPlatforms.length === 0 ||
                  !summary.trim() ||
                  selectedPlatformConfigs.some(
                    (platform) => !platformContent[platform.value]?.trim(),
                  ) ||
                  isOverLimit ||
                  !isScheduleDateValid
                }
              >
                Compose
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostComposer;
