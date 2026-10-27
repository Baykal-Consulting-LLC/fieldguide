"""Meaningful metric invariants; run python3 -m unittest discover -s research/validation-053-external."""
import unittest, importlib.util, pathlib
spec=importlib.util.spec_from_file_location('compare',pathlib.Path(__file__).with_name('compare.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Metrics(unittest.TestCase):
    def test_pearson_centering_and_scaling(self):
        a=[2,4,9,3,8,1];self.assertAlmostEqual(m.pearson(a,[x*3+10 for x in a]),1);self.assertAlmostEqual(m.pearson(a,[-x for x in a]),-1)
    def test_no_fabricated_flat_correlation(self):
        self.assertIsNone(m.pearson([3]*6,[1,2,3,4,5,6]));self.assertIsNone(m.pearson([3]*6,None))
    def test_ranks_with_ties(self):
        self.assertEqual(m.ranks([3,1,3,2]),[3.5,1,3.5,2]);self.assertAlmostEqual(m.spearman([1,2,2,4],[2,4,4,8]),1);self.assertAlmostEqual(m.kendall([1,2,2,4],[4,2,2,1]),-1)
    def test_topk_includes_cutoff_ties(self):
        self.assertEqual(m.topk([.9,.8,.8,.2],['a','b','c','d'],2),{'a','b','c'});self.assertEqual(m.jaccard({'a','b'},{'b','c'}),1/3);self.assertIsNone(m.jaccard(set(),set()))
    def test_fit_boundaries(self):
        self.assertEqual([m.tier(x) for x in [None,-.001,0,.607999,.608,.728999,.729]], [None,0,1,1,2,2,3])
if __name__=='__main__':unittest.main()
