from enum import Enum, auto


#####################
#       Enums       #
#####################
class MediaType(str, Enum):
    JSON = 'json'
    BMP = 'bmp'


class Flag(str, Enum):
    """States to mark and highlight specific documents."""

    NONE = 'none'
    STAR = 'star'
    ERROR = 'error'


class Rank(int, Enum):
    """Indicates which types of accounts can view a document."""

    HIGHEST = auto()    # Only viewable by us
    HIGH = auto()
    MEDIUM = auto()     # Viewable by select guests
    LOW = auto()
    LOWEST = auto()     # Anyone can view


###############################
#       Arbitrary Types       #
###############################
class Immutable:
    """Fields that cannot be changed once set"""


class ImmutableString(Immutable, str):
    pass


class ImmutableInteger(Immutable, int):
    pass


class ImmutableList(Immutable, list):
    pass
