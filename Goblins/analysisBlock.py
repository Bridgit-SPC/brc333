import pandas as pd
import re
import sys
import os

# Check if the input file and field are provided as command-line arguments
if len(sys.argv) != 3:
    print("Usage: python3 analysisBlock.py <input_file.csv> <field_name>")
    sys.exit(1)

input_file = sys.argv[1]
field_name = sys.argv[2]

# After reading the CSV file
df = pd.read_csv(input_file)

# Check if the specified field exists in the CSV
if field_name not in df.columns:
    print(f"Field '{field_name}' not found in the CSV file.")
    print("Available columns:")
    for col in df.columns:
        print(f"- {col}")
    field_name = input("Please enter a valid column name: ")

# Now drop the header row and reset the index
df = df.iloc[0:].reset_index(drop=True)

# Now proceed with the analysis using the valid field_name
field_values = df[field_name].tolist()

print(f"First 5 values of {field_name}:")
print(field_values[:5])
print(f"Total number of {field_name} values: {len(field_values)}")

# Determine if the field contains numeric values
is_numeric = pd.to_numeric(df[field_name], errors='coerce').notnull().all()

# Modify find_multiples function to handle non-numeric data
def find_multiples(values, multiple):
    matching_values = [value for value in values if isinstance(value, (int, float)) and int(value) % multiple == 0]
    count = len(matching_values)
    return matching_values, count

def find_multiples(values, multiple):
    matching_values = [value for value in values if isinstance(value, (int, float)) and int(value) % multiple == 0]
    count = len(matching_values)
    return matching_values, count



# Generate output file name
output_file = f'{os.path.splitext(input_file)[0]}_{field_name}_analysis.xlsx'

# Read the block numbers from the file
with open(input_file, 'r') as file:
    blocks = file.read().splitlines()

# Modify analysis functions to handle non-numeric data

def find_repeating_digits(values, digit, min_repeats):
    pattern = re.compile(f"({str(digit)}{{{min_repeats},}})")
    matching_values = [value for value in values if pattern.search(str(value))]
    count = len(matching_values)
    return matching_values, count

def find_palindromes(values, length):
    matching_values = [value for value in values if str(value) == str(value)[::-1] and len(str(value)) == length]
    count = len(matching_values)
    return matching_values, count

# Function to find 4 and 5 digit perfect squares
def find_perfect_squares(values):
    def is_perfect_square(n):
        root = int(n**0.5)
        return n == root * root

    matching_values = [value for value in values if (len(str(value)) == 4 or len(str(value)) == 5) and is_perfect_square(int(value))]
    count = len(matching_values)
    return matching_values, count

# Function to find blocks containing 420
def find_contains(values, number):
    number_str = str(number)
    matching_values = [value for value in values if number_str in str(value)]
    count = len(matching_values)
    return matching_values, count

def is_power_of_7(n):
    if n <= 0:
        return False
    while n % 7 == 0:
        n //= 7
    return n == 1

def find_power_of_7(values):
    matching_values = []
    for value in values:
        try:
            if is_power_of_7(int(value)):
                matching_values.append(value)
        except ValueError:
            continue
    count = len(matching_values)
    return matching_values, count

# Function to find powers of 7
def find_power_of_7(values):
    matching_values = []
    for value in values:
        try:
            if is_power_of_7(int(value)):
                matching_values.append(value)
        except ValueError:
            continue
    count = len(matching_values)
    return matching_values, count

# Function to find Fibonacci numbers within blocks
def find_fibonacci(values, length):
    def generate_fibonacci(limit):
        fibs = [0, 1]
        while len(str(fibs[-1])) <= limit:
            fibs.append(fibs[-1] + fibs[-2])
        return fibs

    fib_numbers = set(str(num) for num in generate_fibonacci(length + 1) if len(str(num)) == length)
    matching_values = [value for value in values if any(fib in str(value) for fib in fib_numbers)]
    count = len(matching_values)
    return matching_values, count

# Patterns to check
patterns = {
    '0': find_repeating_digits(field_values, '0', 1),
    '00': find_repeating_digits(field_values, '0', 2),
    '000': find_repeating_digits(field_values, '0', 3),
    '0000': find_repeating_digits(field_values, '0', 4),
    '00000': find_repeating_digits(field_values, '0', 5),
    '1': find_repeating_digits(field_values, '1', 1),
    '11': find_repeating_digits(field_values, '1', 2),
    '111': find_repeating_digits(field_values, '1', 3),
    '1111': find_repeating_digits(field_values, '1', 4),
    '11111': find_repeating_digits(field_values, '1', 5),
    '2': find_repeating_digits(field_values, '2', 1),
    '22': find_repeating_digits(field_values, '2', 2),
    '222': find_repeating_digits(field_values, '2', 3),
    '2222': find_repeating_digits(field_values, '2', 4),
    '22222': find_repeating_digits(field_values, '2', 5),
    '3': find_repeating_digits(field_values, '3', 1),
    '33': find_repeating_digits(field_values, '3', 2),
    '333': find_repeating_digits(field_values, '3', 3),
    '3333': find_repeating_digits(field_values, '3', 4),
    '33333': find_repeating_digits(field_values, '3', 5),
    '4': find_repeating_digits(field_values, '4', 1),
    '44': find_repeating_digits(field_values, '4', 2),
    '444': find_repeating_digits(field_values, '4', 3),
    '4444': find_repeating_digits(field_values, '4', 4),
    '44444': find_repeating_digits(field_values, '4', 5),
    '5': find_repeating_digits(field_values, '5', 1),
    '55': find_repeating_digits(field_values, '5', 2),
    '555': find_repeating_digits(field_values, '5', 3),
    '5555': find_repeating_digits(field_values, '5', 4),
    '55555': find_repeating_digits(field_values, '5', 5),
    '6': find_repeating_digits(field_values, '6', 1),
    '66': find_repeating_digits(field_values, '6', 2),
    '666': find_repeating_digits(field_values, '6', 3),
    '6666': find_repeating_digits(field_values, '6', 4),
    '66666': find_repeating_digits(field_values, '6', 5),
    '7': find_repeating_digits(field_values, '7', 1),
    '77': find_repeating_digits(field_values, '7', 2),
    '777': find_repeating_digits(field_values, '7', 3),
    '7777': find_repeating_digits(field_values, '7', 4),
    '77777': find_repeating_digits(field_values, '7', 5),
    '8': find_repeating_digits(field_values, '8', 1),
    '88': find_repeating_digits(field_values, '8', 2),
    '888': find_repeating_digits(field_values, '8', 3),
    '8888': find_repeating_digits(field_values, '8', 4),
    '88888': find_repeating_digits(field_values, '8', 5),
    '9': find_repeating_digits(field_values, '9', 1),
    '99': find_repeating_digits(field_values, '9', 2),
    '999': find_repeating_digits(field_values, '9', 3),
    '9999': find_repeating_digits(field_values, '9', 4),
    '99999': find_repeating_digits(field_values, '9', 5),
    'Palindrome 5': find_palindromes(field_values, 5),
    'Palindrome 6': find_palindromes(field_values, 6),
    'Multiples of 7': find_multiples(field_values, 7),
    'Multiples of 8': find_multiples(field_values, 8),
    'Multiples of 9': find_multiples(field_values, 9),
    'Multiples of 10': find_multiples(field_values, 10),
    'Multiples of 11': find_multiples(field_values, 11),
    'Multiples of 12': find_multiples(field_values, 12),
    'Multiples of 13': find_multiples(field_values, 13),
    'Multiples of 14': find_multiples(field_values, 14),
    'Multiples of 15': find_multiples(field_values, 15),
    'Multiples of 16': find_multiples(field_values, 16),
    'Multiples of 17': find_multiples(field_values, 17),
    'Multiples of 18': find_multiples(field_values, 18),
    'Multiples of 19': find_multiples(field_values, 19),
    'Multiples of 20': find_multiples(field_values, 20),
    'Multiples of 21': find_multiples(field_values, 21),
    'Multiples of 22': find_multiples(field_values, 22),
    'Multiples of 23': find_multiples(field_values, 23),
    'Multiples of 24': find_multiples(field_values, 24),
    'Multiples of 25': find_multiples(field_values, 25),
    'Multiples of 26': find_multiples(field_values, 26),
    'Multiples of 27': find_multiples(field_values, 27),
    'Multiples of 28': find_multiples(field_values, 28),
    'Multiples of 29': find_multiples(field_values, 29),
    'Multiples of 30': find_multiples(field_values, 30),
    'Multiples of 31': find_multiples(field_values, 31),
    'Multiples of 32': find_multiples(field_values, 32),
    'Multiples of 33': find_multiples(field_values, 33),
    'Multiples of 34': find_multiples(field_values, 34),
    'Multiples of 35': find_multiples(field_values, 35),
    'Multiples of 36': find_multiples(field_values, 36),
    'Multiples of 37': find_multiples(field_values, 37),
    'Multiples of 38': find_multiples(field_values, 38),
    'Multiples of 39': find_multiples(field_values, 39),
    'Multiples of 40': find_multiples(field_values, 40),
    'Multiples of 41': find_multiples(field_values, 41),
    'Multiples of 42': find_multiples(field_values, 42),
    'Multiples of 43': find_multiples(field_values, 43),
    'Multiples of 44': find_multiples(field_values, 44),
    'Multiples of 45': find_multiples(field_values, 45),
    'Multiples of 46': find_multiples(field_values, 46),
    'Multiples of 47': find_multiples(field_values, 47),
    'Multiples of 48': find_multiples(field_values, 48),
    'Multiples of 49': find_multiples(field_values, 49),
    'Multiples of 50': find_multiples(field_values, 50),
    'Multiples of 51': find_multiples(field_values, 51),
    'Multiples of 52': find_multiples(field_values, 52),
    'Multiples of 53': find_multiples(field_values, 53),
    'Multiples of 54': find_multiples(field_values, 54),
    'Multiples of 55': find_multiples(field_values, 55),
    'Multiples of 56': find_multiples(field_values, 56),
    'Multiples of 57': find_multiples(field_values, 57),
    'Multiples of 58': find_multiples(field_values, 58),
    'Multiples of 59': find_multiples(field_values, 59),
    'Multiples of 60': find_multiples(field_values, 60),
    'Multiples of 61': find_multiples(field_values, 61),
    'Multiples of 62': find_multiples(field_values, 62),
    'Multiples of 63': find_multiples(field_values, 63),
    'Multiples of 64': find_multiples(field_values, 64),
    'Multiples of 65': find_multiples(field_values, 65),
    'Multiples of 66': find_multiples(field_values, 66),
    'Multiples of 67': find_multiples(field_values, 67),
    'Multiples of 68': find_multiples(field_values, 68),
    'Multiples of 69': find_multiples(field_values, 69),
    'Multiples of 70': find_multiples(field_values, 70),
    'Multiples of 71': find_multiples(field_values, 71),
    'Multiples of 72': find_multiples(field_values, 72),
    'Multiples of 73': find_multiples(field_values, 73),
    'Multiples of 74': find_multiples(field_values, 74),
    'Multiples of 75': find_multiples(field_values, 75),
    'Multiples of 76': find_multiples(field_values, 76),
    'Multiples of 77': find_multiples(field_values, 77),
    'Multiples of 78': find_multiples(field_values, 78),
    'Multiples of 79': find_multiples(field_values, 79),
    'Multiples of 80': find_multiples(field_values, 80),
    'Multiples of 81': find_multiples(field_values, 81),
    'Multiples of 82': find_multiples(field_values, 82),
    'Multiples of 83': find_multiples(field_values, 83),
    'Multiples of 84': find_multiples(field_values, 84),
    'Multiples of 85': find_multiples(field_values, 85),
    'Multiples of 86': find_multiples(field_values, 86),
    'Multiples of 87': find_multiples(field_values, 87),
    'Multiples of 88': find_multiples(field_values, 88),
    'Multiples of 89': find_multiples(field_values, 89),
    'Multiples of 90': find_multiples(field_values, 90),
    'Multiples of 91': find_multiples(field_values, 91),
    'Multiples of 92': find_multiples(field_values, 92),
    'Multiples of 93': find_multiples(field_values, 93),
    'Multiples of 94': find_multiples(field_values, 94),
    'Multiples of 95': find_multiples(field_values, 95),
    'Multiples of 96': find_multiples(field_values, 96),
    'Multiples of 97': find_multiples(field_values, 97),
    'Multiples of 98': find_multiples(field_values, 98),
    'Multiples of 99': find_multiples(field_values, 99),
    'Multiples of 100': find_multiples(field_values, 100),
    'Multiples of 101': find_multiples(field_values, 101),
    'Multiples of 102': find_multiples(field_values, 102),
    'Multiples of 103': find_multiples(field_values, 103),
    'Multiples of 104': find_multiples(field_values, 104),
    'Multiples of 105': find_multiples(field_values, 105),
    'Multiples of 106': find_multiples(field_values, 106),
    'Multiples of 107': find_multiples(field_values, 107),
    'Multiples of 108': find_multiples(field_values, 108),
    'Multiples of 177': find_multiples(field_values, 177),
    'Multiples of 178': find_multiples(field_values, 178),
    'Multiples of 179': find_multiples(field_values, 179),
    'Multiples of 180': find_multiples(field_values, 180),
    'Multiples of 181': find_multiples(field_values, 181),
    'Multiples of 182': find_multiples(field_values, 182),
    'Multiples of 183': find_multiples(field_values, 183),
    'Multiples of 184': find_multiples(field_values, 184),
    'Multiples of 185': find_multiples(field_values, 185),
    'Multiples of 186': find_multiples(field_values, 186),
    'Multiples of 187': find_multiples(field_values, 187),
    'Multiples of 188': find_multiples(field_values, 188),
    'Multiples of 189': find_multiples(field_values, 189),
    'Multiples of 220': find_multiples(field_values, 220),
    'Multiples of 221': find_multiples(field_values, 221),
    'Multiples of 222': find_multiples(field_values, 222),
    'Multiples of 223': find_multiples(field_values, 223),
    'Multiples of 224': find_multiples(field_values, 224),
    'Multiples of 225': find_multiples(field_values, 225),
    'Multiples of 226': find_multiples(field_values, 226),
    'Multiples of 227': find_multiples(field_values, 227),
    'Multiples of 228': find_multiples(field_values, 228),
    'Multiples of 229': find_multiples(field_values, 229),
    'Multiples of 230': find_multiples(field_values, 230),
    'Multiples of 231': find_multiples(field_values, 231),
    'Multiples of 232': find_multiples(field_values, 232),
    'Multiples of 233': find_multiples(field_values, 233),
    'Multiples of 234': find_multiples(field_values, 234),
    'Multiples of 320': find_multiples(field_values, 220),
    'Multiples of 321': find_multiples(field_values, 221),
    'Multiples of 322': find_multiples(field_values, 222),
    'Multiples of 323': find_multiples(field_values, 223),
    'Multiples of 324': find_multiples(field_values, 224),
    'Multiples of 325': find_multiples(field_values, 225),
    'Multiples of 326': find_multiples(field_values, 226),
    'Multiples of 327': find_multiples(field_values, 227),
    'Multiples of 328': find_multiples(field_values, 228),
    'Multiples of 329': find_multiples(field_values, 229),
    'Multiples of 330': find_multiples(field_values, 230),
    'Multiples of 331': find_multiples(field_values, 231),
    'Multiples of 332': find_multiples(field_values, 232),
    'Multiples of 333': find_multiples(field_values, 233),
    'Multiples of 334': find_multiples(field_values, 234),
    'Multiples of 420': find_multiples(field_values, 420),
    'Multiples of 421': find_multiples(field_values, 421),
    'Multiples of 422': find_multiples(field_values, 422),
    'Multiples of 423': find_multiples(field_values, 423),
    'Multiples of 424': find_multiples(field_values, 424),
    'Multiples of 425': find_multiples(field_values, 425),
    'Multiples of 426': find_multiples(field_values, 426),
    'Multiples of 427': find_multiples(field_values, 427),
    'Multiples of 428': find_multiples(field_values, 428),
    'Multiples of 429': find_multiples(field_values, 429),
    'Multiples of 430': find_multiples(field_values, 430),
    'Multiples of 431': find_multiples(field_values, 431),
    'Multiples of 432': find_multiples(field_values, 432),
    'Multiples of 433': find_multiples(field_values, 433),
    'Multiples of 434': find_multiples(field_values, 434),
    'Multiples of 520': find_multiples(field_values, 520),
    'Multiples of 521': find_multiples(field_values, 521),
    'Multiples of 522': find_multiples(field_values, 522),
    'Multiples of 523': find_multiples(field_values, 523),
    'Multiples of 524': find_multiples(field_values, 524),
    'Multiples of 525': find_multiples(field_values, 525),
    'Multiples of 526': find_multiples(field_values, 526),
    'Multiples of 527': find_multiples(field_values, 527),
    'Multiples of 528': find_multiples(field_values, 528),
    'Multiples of 529': find_multiples(field_values, 529),
    'Multiples of 530': find_multiples(field_values, 530),
    'Multiples of 531': find_multiples(field_values, 531),
    'Multiples of 532': find_multiples(field_values, 532),
    'Multiples of 533': find_multiples(field_values, 533),
    'Multiples of 534': find_multiples(field_values, 534),
    'Multiples of 920': find_multiples(field_values, 920),
    'Multiples of 921': find_multiples(field_values, 921),
    'Multiples of 922': find_multiples(field_values, 922),
    'Multiples of 923': find_multiples(field_values, 923),
    'Multiples of 924': find_multiples(field_values, 924),
    'Multiples of 925': find_multiples(field_values, 925),
    'Multiples of 926': find_multiples(field_values, 926),
    'Multiples of 927': find_multiples(field_values, 927),
    'Multiples of 928': find_multiples(field_values, 928),
    'Multiples of 929': find_multiples(field_values, 929),
    'Multiples of 930': find_multiples(field_values, 930),
    'Multiples of 931': find_multiples(field_values, 931),
    'Multiples of 932': find_multiples(field_values, 932),
    'Multiples of 933': find_multiples(field_values, 933),
    'Multiples of 934': find_multiples(field_values, 934),
    'Contains 67': find_contains(field_values,67),
    'Contains 68': find_contains(field_values,68),
    'Contains 69': find_contains(field_values,69),
    'Contains 70': find_contains(field_values,70),
    'Contains 71': find_contains(field_values,71),
    'Contains 72': find_contains(field_values,72),
    'Contains 73': find_contains(field_values,73),
    'Contains 74': find_contains(field_values,74),
    'Contains 75': find_contains(field_values,75),
    'Contains 76': find_contains(field_values,76),
    'Contains 77': find_contains(field_values,77),
    'Contains 78': find_contains(field_values,78),
    'Contains 79': find_contains(field_values,79),
    'Contains 80': find_contains(field_values,80),
    'Contains 81': find_contains(field_values,81),
    'Contains 82': find_contains(field_values,82),
    'Contains 83': find_contains(field_values,83),
    'Contains 84': find_contains(field_values,84),
    'Contains 85': find_contains(field_values,85),
    'Contains 86': find_contains(field_values,86),
    'Contains 87': find_contains(field_values,87),
    'Contains 88': find_contains(field_values,88),
    'Contains 89': find_contains(field_values,89),
    'Contains 90': find_contains(field_values,90),
    'Contains 91': find_contains(field_values,91),
    'Contains 92': find_contains(field_values,92),
    'Contains 93': find_contains(field_values,93),
    'Contains 94': find_contains(field_values,94),
    'Contains 95': find_contains(field_values,95),
    'Contains 96': find_contains(field_values,96),
    'Contains 97': find_contains(field_values,97),
    'Contains 98': find_contains(field_values,98),
    'Contains 99': find_contains(field_values,99),
    'Contains 108': find_contains(field_values,108),
    'Contains 321': find_contains(field_values,321),
    'Contains 420': find_contains(field_values,420),
    'Contains 1089': find_contains(field_values,1089),
    'Contains 4761': find_contains(field_values,4761),
    'Contains 28980': find_contains(field_values,28980),
    'Contains 176400': find_contains(field_values,176400),
    'Power of 7': find_power_of_7(field_values),
    '3-digit Fibonacci': find_fibonacci(field_values, 3),
    '4-digit Fibonacci': find_fibonacci(field_values, 4),
    '5-digit Fibonacci': find_fibonacci(field_values, 5),
    '6-digit Fibonacci': find_fibonacci(field_values, 6)
}

# Convert the results to a DataFrame
summary = {key: value[1] for key, value in patterns.items()}
summary_df = pd.DataFrame(list(summary.items()), columns=['Pattern', 'Count'])

# Save the DataFrame to an Excel file
with pd.ExcelWriter(output_file) as writer:
    summary_df.to_excel(writer, sheet_name='Summary', index=False)
    for pattern, (values, count) in patterns.items():
        df = pd.DataFrame(values, columns=[pattern])
        df.to_excel(writer, sheet_name=pattern, index=False)

print(f"Analysis complete. Results saved to {output_file}")
print(summary_df)

