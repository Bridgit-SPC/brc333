import sys
import numpy as np
from PIL import Image
import webcolors
import os

def create_html_color_list(image_path, colors, html_file_path):
    with open(html_file_path, 'w') as html_file:
        html_file.write('<!DOCTYPE html>\n<html><head><style>')
        html_file.write('.color-box{width: 50px; height: 20px; display: inline-block; margin-right: 10px; border: 1px solid #000;}')
        html_file.write('.flex-container {display: flex;}')
        html_file.write('.flex-child {flex: 1; padding: 10px;}')
        html_file.write('img{image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; width: 500px; height: auto;}')  # CSS to prevent smoothing
        html_file.write('</style></head><body>\n')
        html_file.write('<div class="flex-container">\n')
        html_file.write(f'<div class="flex-child"><img src="{image_path}" alt="Source Image"></div>\n')
        html_file.write('<div class="flex-child"><h1>Colors in Image</h1>\n<ul>\n')
        for hex_code, count in colors.items():
            html_file.write(f'<li><button class="color-box" style="background-color:{hex_code};" onclick="copyToClipboard(\'{hex_code}\')"></button> {hex_code} - {count}</li>\n')
        html_file.write('</ul></div></div>\n')
        html_file.write('<script>')
        html_file.write('function copyToClipboard(text) {')
        html_file.write('  var dummy = document.createElement("textarea");')
        html_file.write('  document.body.appendChild(dummy);')
        html_file.write('  dummy.value = text;')
        html_file.write('  dummy.select();')
        html_file.write('  document.execCommand("copy");')
        html_file.write('  document.body.removeChild(dummy);')
        html_file.write('  alert("Copied " + text);')
        html_file.write('}')
        html_file.write('</script>\n')
        html_file.write('</body></html>\n')

def closest_color(requested_color):
    try:
        closest_name = actual_name = webcolors.rgb_to_name(requested_color)
    except ValueError:
        closest_name = webcolors.rgb_to_hex(requested_color)
    return closest_name

def get_image_colors(image_path):
    image = Image.open(image_path)
    image = image.convert('RGB')
    
    colors = image.getcolors(1000000)  # A high number to get all colors if possible
    color_names = {}
    
    for count, color in colors:
        color_name = closest_color(color)
        color_names[color_name] = color_names.get(color_name, 0) + count
    
    return color_names

def get_color_coordinates(image_path, color_to_find):
    image = Image.open(image_path)
    image = image.convert('RGB')
    rgba_image = np.array(image)
    coordinates = []
    
    for y in range(rgba_image.shape[0]):
        for x in range(rgba_image.shape[1]):
            current_color = tuple(rgba_image[y, x])
            if current_color == color_to_find or webcolors.rgb_to_hex(current_color) == color_to_find:
                coordinates.append({'x': x + 1, 'y': y + 1})
                
    return coordinates

def get_all_color_coordinates(image_path):
    image = Image.open(image_path)
    image = image.convert('RGB')
    pixels = np.array(image)
    color_coordinates = {}
    for y in range(image.height):
        for x in range(image.width):
            color = tuple(pixels[y, x])
            hex_color = webcolors.rgb_to_hex(color)
            if hex_color not in color_coordinates:
                color_coordinates[hex_color] = []
            color_coordinates[hex_color].append([x, y])
    return color_coordinates

def save_coordinates_and_colors(coordinates, file_path):
    with open(file_path, 'w') as file:
        for color, coords in coordinates.items():
            file.write(f'"{color}": {coords},\n')

def main():
    if len(sys.argv) < 2:
        print("Please provide an image file path.")
        sys.exit(1)

    # Get the image path from the first command line argument
    image_path = sys.argv[1]
    color_names = get_image_colors(image_path)

    # Create an HTML file to display the colors
    html_file_path = 'colors_in_image.html'

    all_color_coordinates = get_all_color_coordinates(image_path)
    coordinates_file_path = './coordinates/' + os.path.basename(image_path).split('.')[0] + '_coordinates.txt'
    save_coordinates_and_colors(all_color_coordinates, coordinates_file_path)
    print(f"Coordinates and colors saved to {coordinates_file_path}")

    # Create an HTML file to display the colors and the image
    create_html_color_list(image_path, color_names, html_file_path)
    print(f"HTML file created with color list: {html_file_path}")

    # Ask user for color input
    selected_colors = input("Enter the names or hex codes of the colors you want coordinates for (separate by space): ").strip().split()

    # Process each color
    for selected_color in selected_colors:
        # Attempt to convert the name to RGB, if it fails, assume it's already a hex code
        try:
            selected_color_rgb = webcolors.name_to_rgb(selected_color)
        except ValueError:
            selected_color_rgb = selected_color

        # Get the coordinates for the selected color
        coordinates = get_color_coordinates(image_path, selected_color_rgb)

        # Append the coordinates to a file
        output_file_name = image_path + '_coordinates.txt'
        with open(output_file_name, 'a') as file:
            file.write(f'"{selected_color}": [\n')
            for coord in coordinates:
                file.write(f'    {coord},\n')
            file.write('],\n')

        print(f"Coordinates for {selected_color} appended to {output_file_name}")

if __name__ == "__main__":
    main()
