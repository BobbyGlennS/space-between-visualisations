# CONVERT FUNCTION =============================================================
convert_data <- 
  function(data_file, out_file_name = data_file, alternative_palette = FALSE){

  # get data
  df_ratings <- read.csv(data_file, header = TRUE)
  df_colours <- read.csv("colour_scale.csv", header = TRUE)
  names(df_colours)[1] <- "mood_mean"
  
  # get time in seconds and replace the unit variable in df_ratings with that.
  rating_times <- lubridate::ms(df_ratings$time)
  df_ratings$unit <- 
    lubridate::minute(rating_times) * 60 + lubridate::second(rating_times)
  
  df_ratings$mood_mean <- round(df_ratings$mood_mean, 1)
  mood_index <- 
    unlist(lapply(df_ratings$mood_mean, 
                  function (x) which(df_colours$mood_mean == x)))
  if (alternative_palette == TRUE){
    mood_colours <- paste0("#", df_colours$hex_code2[mood_index])
  } else {
    mood_colours <- paste0("#", df_colours$hex_code[mood_index])  
  }
  
  mood_offset <- paste0(df_ratings$unit / max(df_ratings$unit) * 100, "%")
  
  df_out <- data.frame(unit = df_ratings$unit,
                       time = df_ratings$time,
                       engagement_mean = df_ratings$engagement_mean,
                       mood_mean = df_ratings$mood_mean,
                       mood_colour = mood_colours,
                       offset = mood_offset,
                       laughter_start = df_ratings$laughter_start,
                       laughter_duration = 
                         df_ratings$laughter_end - df_ratings$laughter_start,
                       type_colour = df_ratings$type_colour)
  
  write.csv(df_out, file = out_file_name, row.names=FALSE)
}

# PROCESS ALL DATAFILES ========================================================
# GO TO ARCHIVE / FOR_DISTRIBUTION / FILES / DATA FOLDER AND RUN FROM THERE.
data_files <- list.files(pattern = ".")
out_files <- stringr::str_replace(data_files, "^dt_", "")
out_files <- stringr::str_replace(out_files, "_HW.*", ".csv")

for (ii in 2:5) convert_data(data_files[ii], out_files[ii], TRUE)
