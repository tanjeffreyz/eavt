from src.database.fields import Opt, Imm


#########################
#       Interfaces      #
#########################
class Document(Imm.ID, Imm.ParentID,
               Opt.DateTime, Opt.Flag):
    """
    Queryable base model for all documents that take part in a tree structure.
    Each type of Document, like Session or Trial, is stored in its own collection.
    """
