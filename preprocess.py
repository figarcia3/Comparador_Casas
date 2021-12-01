import json
import time
import pandas as pd
from collections import defaultdict
# from googlemaps import GoogleMaps
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

# API_KEY = "AIzaSyDvuBABEc6A3XTQh3e-hmwcAp8sSMjGDCc"
# gmaps = GoogleMaps(API_KEY)

start = time.time()

# Abrimos el archivo excel y lo pasamos a un DataFrame.
df = pd.read_excel("data\data.xlsx")

# Almacenamos las columnas numericas de nuestro DataFrame.
numeric_columns = ['N_Habitaciones', 
                   'N_Baños',
                   'N_Estacionamientos', 
                   'Total_Superficie_M2', 
                   'Superficie_Construida_M2',
                   'Valor_UF']

# Para cada columna numerica, si posee algún valor que no sea
# numerico, lo setiamos en nulls. 
for c in numeric_columns:
       df[c] = pd.to_numeric(df[c], errors='coerce')

# Eliminamos todas las columnas que posean nulls.
print(f"Shape: {df.shape}")
df = df.fillna(0)
print(f"Shape 2: {df.shape}")

# # Seleccionamos las comunas que nos servirán para la visualización.
# Ref: https://towardsdatascience.com/geocode-with-python-161ec1e62b89
locator = Nominatim(user_agent="smy-application")
# 1 - conveneint function to delay between geocoding calls
geocode = RateLimiter(locator.geocode, min_delay_seconds=1)
# 2- - create location column
df['location'] = df['Dirección'].apply(geocode)
# 3 - create longitude, laatitude and altitude from location column (returns tuple)
df['point'] = df['location'].apply(lambda loc: tuple(loc.point) if loc else None)
# 4 - split point column into latitude, longitude and altitude columns
df[['latitude', 'longitude', 'altitude']] = pd.DataFrame(df['point'].tolist(), index=df.index)

df = df[['Comuna', 
        'Tipo_Vivienda',
        'N_Habitaciones', 
        'N_Baños',
        'N_Estacionamientos', 
        'Total_Superficie_M2', 
        'Superficie_Construida_M2',
        'Valor_UF',
        'latitude', 
        'longitude',
        'Dirección',
        'Link']]

df = df.dropna()
print(f"Shape 3: {df.shape}")

#Filtramos los límites de la region metropolitana.
df = df[(df['latitude'] <= -32) & (df['latitude'] >= -34)]
df = df[(df['longitude'] <= -69) & (df['longitude'] >= -71)]

print(f"Shape 4: {df.shape}")

# Agrupamos por comuna.
df = (df.groupby(by=["Comuna"])
            .apply(lambda x: x[['Tipo_Vivienda',
                                'N_Habitaciones', 
                                'N_Baños',
                                'N_Estacionamientos', 
                                'Total_Superficie_M2', 
                                'Superficie_Construida_M2',
                                'Valor_UF',
                                'latitude', 
                                'longitude',
                                'Dirección',
                                'Link']].to_dict("records"))
            .reset_index()
            .rename(columns={0:'Tipo_Vivienda', 
                            1:'N_Habitaciones',
                            2:'N_Baños',
                            3:'N_Estacionamientos',
                            4:'Total_Superficie_M2',
                            5:'Superficie_Construida_M2',
                            6:'Valor_UF',
                            7:'latitude',
                            8:'longitude',
                            9:'Dirección',
                            10:'Link'}))

# Renombramos la columna de Tipo_Vivienda a data.
result = df.rename(columns={"Tipo_Vivienda": "data"})

# Pasamos a un json el DataFrame que obtuvimos.
result.to_json("data/data.json", orient='records', force_ascii=False, indent=2)

end = time.time()
print(f"Execution Time: {(end-start)/60} min.")

# result = df.to_json(orient="records", encoding=False)
# parsed = json.loads(result)
# print(json.dumps(parsed, indent=4)) 