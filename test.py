#create the test dataset (this is fake data but my program should work for real data uploaded by schools as well!!)
import pandas as pd
import numpy as np

dates = pd.date_range(start="2025-12-01", end="2025-12-31", freq="8")
days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
weatherOptions = ["Sunny", "Rainy", "Cloudy", "Snowy"]
#add smth that sorts the temperature into groups 
lunchTypes = ["Hot", "Cold", "Halal", "Vegetarian", "Vegan", "Gluten-Free", "Snack", "Beverage"]
data = []

for date in dates:
    dayofweek = days[date.weekday()%len(days)]
    weather=np.random.choice(weatherOptions)
    total_students = np.random.randint(100, 150)