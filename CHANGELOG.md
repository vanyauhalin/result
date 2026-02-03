# Changelog

This document records all notable changes to the project, following the [Keep a
Changelog] format and adhering to [Semantic Versioning].

## [Unreleased]

There are no notable changes in this release.

## [0.2.0] - 2026-01-31

### Added

- Add `err(v, err)` overload to support including optional values with error
  results ([dbd7f48]).
- Add default type parameters to `Ok`, `Err`, `ok()`, `err()`, and `must()`
  ([05d87df]).

### Changed

- Change `err()` error type parameter default from `never` to `Error`
  ([5850bea]).

## [0.1.0] - 2025-09-02

### Added

- Add initial implementation ([6efcf95]).

<!-- Definitions -->

[Keep a Changelog]: https://keepachangelog.com/en/1.1.0/
[Semantic Versioning]: https://semver.org/spec/v2.0.0.html

[Unreleased]: https://github.com/vanyauhalin/result/compare/v0.2.0...HEAD/
[0.2.0]: https://github.com/vanyauhalin/result/compare/v0.1.0...v0.2.0/
[0.1.0]: https://github.com/vanyauhalin/result/releases/tag/v0.1.0/

[5850bea]: https://github.com/vanyauhalin/result/commit/5850bea3f5284a35e37dd53007d406d8c5797692/
[05d87df]: https://github.com/vanyauhalin/result/commit/05d87df75efaa0fc9d3e83e62c2cde5da0728fce/
[dbd7f48]: https://github.com/vanyauhalin/result/commit/dbd7f48299578cf0cadc76ddba98298e53a4b8fd/
[6efcf95]: https://github.com/vanyauhalin/result/commit/6efcf95bbecefd9784d8ffc6081d97ce19a8cbc6/
