class SearchQuerySetWrapper(object):
    """
    Decorates a SearchQuerySet object using a generator for efficient iteration
    """
    def __init__(self, qs):
        self.qs = qs

    def count(self):
        return self.qs.count()

    def __iter__(self):
        for result in self.qs:
            yield result.object

    def __getitem__( self, key):
        if isinstance(key, int) and (key >= 0 or key < self.count()):
            # return the object at the specified position
            return self.qs[key].object
        # Pass the slice/range on to the delegate
        return SearchQuerySetWrapper(self.qs[key])