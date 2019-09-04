"""
Usage:
  linear.py [--in_f=IN_F] [--out_f=OUT_F]

Options:
  -h --help                     show this help message and exit
  --in_f=IN_F                   input file
  --out_f=OUT_F                 output file

"""

from docopt import docopt
import pandas as pd
import numpy as np
import spacy
import pickle

from sklearn.metrics import f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.svm import LinearSVC
from sklearn.feature_extraction import DictVectorizer
from sklearn.pipeline import Pipeline

nlp = spacy.load('en_core_web_sm')


def data2feats(data):
    features = []

    for x, ind in data:
        s = nlp(x)

        feats = {}

        feats['w'] = s[ind].text
        feats['w-1'] = s[ind - 1].text

        if len(s) < ind:
            feats['w+1'] = s[ind + 1].text

            if len(s) < ind + 1:
                feats['w+2'] = s[ind + 2].text

        if ind > 1:
            feats['w-2'] = s[ind - 2].text

        feats['w.dep'] = s[ind].dep_

        for c in s[ind].children:
            if c.dep_ == 'dobj':
                feats['w.child'] = c.dep_
            for cc in s[c.i].children:
                if cc.dep_ in ['dobj']:
                    feats['w.grandson'] = cc.dep_

        features.append(feats)

    return features


def prepare_training(data):
    to_feats = []
    y = []
    for _, row in data.iterrows():
        x = row['text']
        ind = row['index']
        label = row['label']
        to_feats.append([x, ind])
        y.append(label)

    x = data2feats(to_feats)
    return x, y


def results(clf, x, y, split):
    """
    print results on data
    :param clf: trained model
    :param x: data
    :param y: correct labels
    :param split - split type (train/dev/test)
    :return:
    """
    y_hat = clf.predict(x)
    print(split, '\t& ',
          '%.1f' % (100.0 * precision_score(y, y_hat)), '\t& ',
          '%.1f' % (100.0 * recall_score(y, y_hat)), '\t& ',
          '%.1f' % (100.0 * f1_score(y, y_hat)), '\\\\')


if __name__ == '__main__':
    arguments = docopt(__doc__)

    in_f = arguments['--in_f']

    df = pd.read_csv(in_f, sep='\t')

    x, y = prepare_training(df)

    X_train, X_test, y_train, y_test = train_test_split(x, y,
                                                        test_size=0.33,
                                                        random_state=42)

    clf = Pipeline([
        ('vectorizer', DictVectorizer()),
        ('classifier', LinearSVC())
    ])

    clf.fit(X_train, y_train)

    print('& precision 	& recall 	& f1 	\\\\ \hline')
    results(clf, X_train, y_train, 'train')
    results(clf, X_test, y_test, 'dev')

    with open(arguments['--out_f'], 'wb') as handle:
        pickle.dump(clf, handle)
