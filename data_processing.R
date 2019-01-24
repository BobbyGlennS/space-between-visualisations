convert_data <- function(data_file, out_file_name = data_file){

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
  mood_colours <- paste0("#", df_colours$hex_code[mood_index])
  mood_offset <- paste0(df_ratings$unit / max(df_ratings$unit) * 100, "%")
  
  df_out <- data.frame(unit = df_ratings$unit,
                       time = df_ratings$time,
                       engagement_mean = df_ratings$engagement_mean,
                       mood_mean = df_ratings$mood_mean,
                       mood_colour = mood_colours,
                       offset = mood_offset)
  
  write.csv(df_out, file = out_file_name, row.names=FALSE)
}


