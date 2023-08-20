import json
import re

def extract_year_from_parentheses(text):
    match = re.search(r'\((\d{4})\)', text)
    if match:
        return int(match.group(1))
    return None

def main():
    input_file_path = 'input.txt'
    output_file_path = 'output.geojson'
    input_encoding = 'utf-8'  # Use the appropriate encoding

    with open(input_file_path, 'r', encoding=input_encoding) as input_file:
        input_text = input_file.read()

    lines = input_text.split('\n')
    features = []

    person = {"name": None, "year": None, "lines": []}
    for line in lines:
        if line.strip() == "":
            if person is not None and person["name"] is not None:
                feature = {
                    "type": "Feature",
                    "properties": {
                        "name": person["name"],
                        "year": person["year"]
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": []
                    }
                }
                features.append(feature)
            person = {"name": None, "year": None, "lines": []}
        elif person is not None and person["name"] is None:
            person["name"] = line.strip()
            person["year"] = extract_year_from_parentheses(line)
        else:
            person["lines"].append(line.strip())

    if person is not None and person["name"] is not None:
        feature = {
            "type": "Feature",
            "properties": {
                "name": person["name"],
                "year": person["year"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": []
            }
        }
        features.append(feature)

    geojson_data = {
        "type": "FeatureCollection",
        "features": features
    }

    with open(output_file_path, 'w', encoding='utf-8') as output_file:
        json.dump(geojson_data, output_file, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    main()
