df_ratings <- read.csv("data.csv", header = TRUE)
df_colours <- read.csv("colour_scale.csv", header = TRUE)
names(df_colours)[1] <- "mood_mean"

mood_index <- 
  unlist(lapply(df_ratings$mood_mean, 
                function (x) which(df_colours$mood_mean == x)))
mood_colours <- paste0("#", df_colours$hex_code[mood_index])

df_out <- data.frame(unit = df_ratings$unit,
                     time = df_ratings$time,
                     engagement_mean = df_ratings$engagement_mean,
                     mood_mean = df_ratings$mood_mean,
                     mood_colour = mood_colours,
                     offset = df_ratings$unit / max(df_ratings$unit) * 100)

write.csv(df_out, file = "data_processed.csv")

