var BlobBuilder = function() {
    this.parts = [];
  }
  
  BlobBuilder.prototype.append = function(part) {
    this.parts.push(part);
    this.blob = undefined; // Invalidate the blob
  };
  
  BlobBuilder.prototype.getBlob = function() {
    if (!this.blob) {
      this.blob = new Blob(this.parts, { type: "text/plain" });
    }
    return this.blob;
};

export default BlobBuilder;