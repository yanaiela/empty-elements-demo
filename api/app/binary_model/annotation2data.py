"""
Usage:
  data4bert.py [--missing=MISSING] [--non_missing=NON_MISSING] [--out_file=OUT_FILE]

Options:
  -h --help                     show this help message and exit
  --missing=MISSING             missing excel file
  --non_missing=NON_MISSING     non missing txt file
  --out_file=OUT_FILE           output file

"""

from docopt import docopt
import pandas as pd
import numpy as np
import spacy

nlp = spacy.load('en_core_web_sm', disable=["parser", "ner"])


def read_missing(f_in):
    df = pd.read_excel(f_in)
    text = df['Sentence'].tolist()

    data = []
    for x in text:
        split = x.split('_____')
        prev = split[0].split()[-1]
        after = split[1].split()[0]
        row_text = ''.join(split).replace('_____', '')
        data.append([row_text, prev, after])
        # print(data[-1])
        # print()
    return data


def read_non_missing(f_in):
    with open(f_in, 'r') as f:
        lines = f.readlines()
        lines = [x.strip() for x in lines]

    data = []
    for x in lines:
        text_split = x.split('/')
        if len(text_split[1].split()) > 1:
            continue
        text = ''.join(text_split)
        after = text_split[2].split()[0]
        data.append([text, text_split[1], after])
        # print(data[-1])
        # print()
    return data


def missing2tokens(data):

    annotated = []
    for x, prev, after in data:
        s = nlp(x)
        found = False
        for w in s:
            if w.text == after:
                if s[w.i - 1].text == prev:
                    annotated.append([x, w.i - 1])
                    found = True
                    break
        assert found, 'duplicate'

    return annotated


if __name__ == '__main__':
    arguments = docopt(__doc__)

    missing_f = arguments['--missing']
    non_missing_f = arguments['--non_missing']
    out_f = arguments['--out_file']

    missing_data = read_missing(missing_f)
    non_missing_data = read_non_missing(non_missing_f)

    annotated_missing = missing2tokens(missing_data)
    annotated_non_missing = missing2tokens(non_missing_data)

    data = [x + [1] for x in annotated_missing]
    data += [x + [0] for x in annotated_non_missing]

    header = ['text', 'index', 'label']

    df = pd.DataFrame(data)
    df.to_csv(out_f, sep='\t', header=header, index=False)

    # np.savetxt("file_name.csv", data, delimiter=",", fmt='%s', header=['text', 'index', 'label'])



