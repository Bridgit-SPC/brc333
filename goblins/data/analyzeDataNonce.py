import sys
import csv
from ast import literal_eval
import os
from collections import Counter

def process_csv(file_path):
    output_file = os.path.splitext(file_path)[0] + '.txt'
    
    with open(file_path, 'r') as file, open(output_file, 'w') as out_file:
        reader = csv.reader(file, delimiter=';')
        header = next(reader)
        
        power_names = header[6].split('[')[1].split(']')[0].split(',')  # if nonce is not present, header[4]
        
        power_totals = [0] * len(power_names)
        power_maxes = [0] * len(power_names)
        power_max_blocks = [''] * len(power_names)
        total_sum = 0
        max_total = 0
        max_total_block = ''
        count = 0
        trait_counter = Counter()
        
        for row in reader:
            block = row[1]
            powers = [int(x) for x in row[6].strip('[]').split(',')]
            traits = row[5].strip('[]').split(',')
            trait_counter.update(traits)
            row_total = sum(powers)
            for i, power in enumerate(powers):
                power_totals[i] += power
                if power > power_maxes[i]:
                    power_maxes[i] = power
                    power_max_blocks[i] = block
            if row_total > max_total:
                max_total = row_total
                max_total_block = block
            total_sum += row_total
            count += 1
        
        power_averages = [total / count for total in power_totals]
        overall_average = total_sum / (count * len(power_names))
        
        def write_output(text):
            print(text)
            out_file.write(text + '\n')
        
        write_output("Power Totals:")
        for name, total in zip(power_names, power_totals):
            write_output(f"{name}: {total}")
        
        write_output("\nPower Averages:")
        for name, avg in zip(power_names, power_averages):
            write_output(f"{name}: {avg:.2f}")
        
        write_output("\nPower Maximums:")
        for name, max_val, block in zip(power_names, power_maxes, power_max_blocks):
            write_output(f"{name}: {max_val} (Block: {block})")
        
        write_output(f"\nTotal Sum of All Powers: {total_sum}")
        write_output(f"Overall Average Score: {overall_average:.2f}")
        write_output(f"Maximum Total Power Score: {max_total} (Block: {max_total_block})")
        
        write_output("\nTrait Occurrences:")
        total_goblins = count  # Assuming 'count' is the total number of goblins processed
        for trait, trait_count in trait_counter.most_common():
            percentage = (trait_count / total_goblins) * 100
            write_output(f"{trait}: {trait_count} ({percentage:.2f}%)")

        write_output(f"\nResults saved to {output_file}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <csv_file_path>")
    else:
        process_csv(sys.argv[1])