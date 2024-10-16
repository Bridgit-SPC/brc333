import os
import sys
import logging

def consolidate_addresses(directory):
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')
    
    if not os.path.isdir(directory):
        logging.error(f"Directory '{directory}' does not exist.")
        return

    all_addresses = set()
    
    for filename in os.listdir(directory):
        if filename.endswith('.txt'):
            file_path = os.path.join(directory, filename)
            with open(file_path, 'r') as file:
                addresses = set(line.strip() for line in file if line.strip())
            logging.info(f"File '{filename}' contains {len(addresses)} addresses.")
            all_addresses.update(addresses)

    output_filename = f"{os.path.basename(directory)}.txt"
    with open(output_filename, 'w') as output_file:
        for address in sorted(all_addresses):
            output_file.write(f"{address}\n")

    logging.info(f"Consolidated file '{output_filename}' contains {len(all_addresses)} unique addresses.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python consolidateSS.py <directory_name>")
    else:
        directory = sys.argv[1]
        consolidate_addresses(directory)
