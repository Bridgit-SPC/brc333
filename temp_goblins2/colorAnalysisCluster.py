import sys
import numpy as np
from PIL import Image
import webcolors
from sklearn.cluster import KMeans
import os

def create_html_color_list(original_image_path, new_image_path, colors, html_file_path):
    with open(html_file_path, 'w') as html_file:
        html_file.write('<!DOCTYPE html>\n<html><head><style>')
        html_file.write('.color-box{width: 50px; height: 20px; display: inline-block; margin-right: 10px; border: 1px solid #000;}')
        html_file.write('.flex-container {display: flex;}')
        html_file.write('.flex-child {flex: 1; padding: 10px;}')
        html_file.write('img{image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; width: 500px; height: auto;}')
        html_file.write('</style></head><body>\n')
        html_file.write('<div class="flex-container">\n')
        html_file.write(f'<div class="flex-child"><img src="{original_image_path}" alt="Source Image"></div>\n')
        html_file.write(f'<div class="flex-child"><img src="{new_image_path}" alt="Clustered Image"></div>\n')
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

def get_clustered_image_colors(image_path, max_colors=50):
    image = Image.open(image_path)
    image = image.convert('RGB')
    pixels = np.array(image).reshape((-1, 3))
    kmeans = KMeans(n_clusters=max_colors)
    kmeans.fit(pixels)
    representative_colors = kmeans.cluster_centers_.astype(int)
    labels = kmeans.labels_
    new_pixels = [tuple(representative_colors[label]) for label in labels]
    unique, counts = np.unique(new_pixels, axis=0, return_counts=True)
    color_counts = {webcolors.rgb_to_hex(color): count for color, count in zip(unique, counts)}
    new_img = Image.new('RGB', image.size)
    new_img.putdata(new_pixels)
    new_image_path = 'clustered_' + os.path.basename(image_path)
    new_img.save(new_image_path)
    return color_counts, new_image_path

def get_color_coordinates(image_path):
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
    if len(sys.argv) < 3:
        max_colors = 5
    else :
        max_colors = int(sys.argv[2])
    print(f"max_colors: {max_colors}")
    color_counts, new_image_path = get_clustered_image_colors(image_path, max_colors)
    html_file_path = 'clusters_in_image.html'
    create_html_color_list(image_path, new_image_path, color_counts, html_file_path)
    print(f"HTML file created with color list: {html_file_path}")
    color_coordinates = get_color_coordinates(new_image_path)
    coordinates_file_path = './coordinates/' + os.path.basename(image_path).split('.')[0] + '_coordinates.txt'
    save_coordinates_and_colors(color_coordinates, coordinates_file_path)
    print(f"Coordinates and colors saved to {coordinates_file_path}")

if __name__ == "__main__":
    main()